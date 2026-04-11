const pool = require("../config/db");
const OCRService = require("../services/ocr.service");
const CurrencyService = require("../services/currency.service");
const { randomUUID } = require("crypto"); // Node.js built-in — no ESM issues

// ──────────────────────────────────────────
// 1. POST /bills/create  —  Employee creates a bill
// ──────────────────────────────────────────
exports.createBill = async (req, res) => {
  const { title, amount, description, category, currency, receipt_url } = req.body;
  const userId = req.user.id;

  console.log("📩 Create bill request:", { title, amount, category, userId, currency });

  if (!title || amount === undefined || amount === null) {
    return res.status(400).json({ success: false, message: "Title and amount are required" });
  }

  const selectedCurrency = currency || 'USD';
  
  try {
    // Calculate converted amount to USD (Base Currency)
    const conversionResult = await CurrencyService.convert(Number(amount), selectedCurrency, 'USD');
    const convertedAmount = conversionResult.convertedAmount;

    const result = await pool.query(
      `INSERT INTO bills (title, amount, description, category, user_id, admin_status, manager_status, current_stage, currency, converted_amount, receipt_url)
       VALUES ($1, $2, $3, $4, $5, 'pending', 'pending', 'admin_review', $6, $7, $8)
       RETURNING *`,
      [title, Number(amount), description || null, category || null, userId, selectedCurrency, convertedAmount, receipt_url || null]
    );

    console.log("✅ Bill created:", result.rows[0].id);

    return res.status(201).json({
      success: true,
      message: "Bill submitted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Create bill error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────
// 2. POST /bills/batch-upload  —  Employee uploads multiple receipts at once
// ──────────────────────────────────────────
exports.batchUpload = async (req, res) => {
  const userId = req.user.id;
  const files = req.files;

  // Validate: at least 1 file, at most 6
  if (!files || files.length === 0) {
    return res.status(400).json({ success: false, message: "No files uploaded" });
  }
  if (files.length > 6) {
    return res.status(400).json({ success: false, message: "Maximum 6 receipts per batch upload" });
  }

  // Generate a shared batch ID for all receipts in this upload
  const batchId = randomUUID();
  console.log(`📦 Batch upload started: batch_id=${batchId}, files=${files.length}, user=${userId}`);

  try {
    // Process all receipts in parallel for performance
    const results = await Promise.all(
      files.map(async (file, index) => {
        try {
          console.log(`🔍 [${index + 1}/${files.length}] Processing: ${file.filename}`);

          // Run OCR on the uploaded image
          let ocrData = { title: null, amount: 0, date: null };
          try {
            ocrData = await OCRService.scanReceipt(file.path);
          } catch (ocrError) {
            // OCR failure is non-fatal — user can edit fields manually
            console.warn(`⚠️ OCR failed for ${file.filename}:`, ocrError.message);
          }

          // Determine amount and currency from OCR or defaults
          const rawAmount = ocrData.amount || 0;
          const currency = 'USD'; // Default; user can override on frontend

          // Convert to USD base currency
          let convertedAmount = rawAmount;
          try {
            const conversion = await CurrencyService.convert(rawAmount, currency, 'USD');
            convertedAmount = conversion.convertedAmount;
          } catch (convErr) {
            console.warn(`⚠️ Currency conversion failed for file ${index + 1}:`, convErr.message);
          }

          // Insert expense record into bills table
          const insertResult = await pool.query(
            `INSERT INTO bills 
              (title, amount, description, category, user_id, admin_status, manager_status, 
               current_stage, currency, converted_amount, receipt_url, batch_id)
             VALUES ($1, $2, $3, $4, $5, 'pending', 'pending', 'admin_review', $6, $7, $8, $9)
             RETURNING *`,
            [
              ocrData.title || `Receipt ${index + 1}`,  // OCR-detected merchant or fallback
              rawAmount,
              ocrData.date ? `Date detected: ${ocrData.date}` : null,
              'Other',           // Default category — user edits on frontend
              userId,
              currency,
              convertedAmount,
              file.path,         // Local file path served statically
              batchId
            ]
          );

          console.log(`✅ [${index + 1}] Bill created: id=${insertResult.rows[0].id}`);

          return {
            success: true,
            bill: insertResult.rows[0],
            ocr: {
              title: ocrData.title,
              amount: ocrData.amount,
              date: ocrData.date,
              failed: rawAmount === 0 && !ocrData.title
            },
            file: {
              filename: file.filename,
              filePath: file.path,
              size: file.size,
              mimetype: file.mimetype
            }
          };
        } catch (fileError) {
          // One file failure should not block others
          console.error(`❌ Failed to process file ${file.filename}:`, fileError.message);
          return {
            success: false,
            file: { filename: file.filename },
            error: fileError.message
          };
        }
      })
    );

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`📦 Batch complete: ${successful.length} succeeded, ${failed.length} failed`);

    return res.status(201).json({
      success: true,
      message: `Batch upload complete: ${successful.length} of ${files.length} receipts processed`,
      batchId,
      data: results
    });
  } catch (error) {
    console.error("❌ Batch upload error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────
// 3. GET /bills/admin  —  Admin sees all bills
// ──────────────────────────────────────────
exports.getAdminBills = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, u.name AS employee_name, u.email AS employee_email
       FROM bills b
       JOIN users u ON u.id = b.user_id
       WHERE u.company_id = $1
       ORDER BY b.created_at DESC`,
       [req.user.company_id]
    );

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("❌ Get admin bills error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────
// 4. GET /bills/admin/batches  —  Admin sees bills grouped by batch_id
// ──────────────────────────────────────────
exports.getBatchedBills = async (req, res) => {
  try {
    // Fetch all bills that are part of a batch for this company
    const result = await pool.query(
      `SELECT b.*, u.name AS employee_name, u.email AS employee_email
       FROM bills b
       JOIN users u ON u.id = b.user_id
       WHERE u.company_id = $1
         AND b.batch_id IS NOT NULL
       ORDER BY b.batch_id, b.created_at DESC`,
      [req.user.company_id]
    );

    // Group bills by batch_id
    const batchMap = {};
    for (const bill of result.rows) {
      const bid = bill.batch_id;
      if (!batchMap[bid]) {
        batchMap[bid] = {
          batch_id: bid,
          employee_name: bill.employee_name,
          employee_email: bill.employee_email,
          submission_date: bill.created_at,
          receipt_count: 0,
          total_amount: 0,
          bills: []
        };
      }
      batchMap[bid].receipt_count++;
      batchMap[bid].total_amount += Number(bill.converted_amount || bill.amount || 0);
      batchMap[bid].bills.push(bill);
    }

    const batches = Object.values(batchMap).sort(
      (a, b) => new Date(b.submission_date) - new Date(a.submission_date)
    );

    return res.json({ success: true, data: batches });
  } catch (error) {
    console.error("❌ Get batched bills error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────
// 5. PATCH /bills/admin/:id  —  Admin approves or rejects
// ──────────────────────────────────────────
exports.adminAction = async (req, res) => {
  const { id } = req.params;
  const { action, comment, assignedManagerId } = req.body; // action: 'approved' | 'rejected'
  const adminId = req.user.id;

  if (!["approved", "rejected"].includes(action)) {
    return res.status(400).json({ success: false, message: "Action must be 'approved' or 'rejected'" });
  }

  try {
    // Verify bill is at admin_review stage and belongs to same company
    const billCheck = await pool.query(
        "SELECT b.*, u.company_id FROM bills b JOIN users u ON u.id = b.user_id WHERE b.id = $1", 
        [id]
    );

    if (billCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }

    const bill = billCheck.rows[0];

    if (bill.company_id !== req.user.company_id) {
      return res.status(403).json({ success: false, message: "Unauthorized access to bill" });
    }

    if (bill.current_stage !== "admin_review") {
      return res.status(400).json({
        success: false,
        message: `Cannot perform admin action — bill is at '${bill.current_stage}' stage`,
      });
    }

    // Determine next stage
    let nextStage = "completed";
    let autoApproveManager = false;
    let assignedManager = null; // Declare it here

    if (action === "approved") {
      const managerCheck = await pool.query(
        "SELECT id FROM users WHERE role = 'manager' AND company_id = $1 LIMIT 1",
        [req.user.company_id]
      );

      if (managerCheck.rows.length > 0) {
        nextStage = "manager_review";
        // Use provided managerId or fallback to the first manager found if not provided
        assignedManager = assignedManagerId || managerCheck.rows[0].id;
      } else {
        nextStage = "completed";
        autoApproveManager = true;
      }
    }

    let result;
    if (autoApproveManager) {
      result = await pool.query(
        `UPDATE bills
         SET admin_status = $1,
             admin_comment = $2,
             admin_reviewed_at = NOW(),
             admin_reviewer_id = $3,
             manager_status = 'approved',
             manager_comment = 'Auto-approved (No manager)',
             manager_reviewed_at = NOW(),
             current_stage = $4
         WHERE id = $5
         RETURNING *`,
        [action, comment || null, adminId, nextStage, id]
      );
    } else {
      result = await pool.query(
        `UPDATE bills
         SET admin_status = $1,
             admin_comment = $2,
             admin_reviewed_at = NOW(),
             admin_reviewer_id = $3,
             manager_reviewer_id = $4,
             current_stage = $5
         WHERE id = $6
         RETURNING *`,
        [action, comment || null, adminId, assignedManager || null, nextStage, id]
      );
    }

    console.log(`✅ Admin ${action} bill ${id} → stage: ${nextStage}`);

    return res.json({
      success: true,
      message: `Bill ${action} by admin`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Admin action error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────
// 6. PUT /bills/:id/action  —  Unified approve/reject (supports batch flow)
//    Body: { status: "APPROVED"|"REJECTED", comment: "..." }
// ──────────────────────────────────────────
exports.billAction = async (req, res) => {
  const { id } = req.params;
  const { status, comment, assignedManagerId } = req.body;
  const actorId = req.user.id;
  const actorRole = req.user.role;

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ success: false, message: "status must be 'APPROVED' or 'REJECTED'" });
  }

  const action = status.toLowerCase(); // 'approved' | 'rejected'

  try {
    const billCheck = await pool.query(
      "SELECT b.*, u.company_id FROM bills b JOIN users u ON u.id = b.user_id WHERE b.id = $1",
      [id]
    );

    if (billCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }

    const bill = billCheck.rows[0];

    if (bill.company_id !== req.user.company_id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    let result;

    if (actorRole === 'admin' && bill.current_stage === 'admin_review') {
      // Admin action — same as adminAction
      const managerCheck = await pool.query(
        "SELECT id FROM users WHERE role = 'manager' AND company_id = $1 LIMIT 1",
        [req.user.company_id]
      );
      const nextStage = action === 'approved' && managerCheck.rows.length > 0 ? 'manager_review' : 'completed';
      const autoManager = action === 'approved' && managerCheck.rows.length === 0;
      const assignedManager = (action === 'approved' && assignedManagerId) || (managerCheck.rows.length > 0 ? managerCheck.rows[0].id : null);

      if (autoManager) {
        result = await pool.query(
          `UPDATE bills SET admin_status=$1, admin_comment=$2, admin_reviewed_at=NOW(), admin_reviewer_id=$3,
           manager_status='approved', manager_comment='Auto-approved (No manager)', manager_reviewed_at=NOW(), current_stage=$4
           WHERE id=$5 RETURNING *`,
          [action, comment || null, actorId, nextStage, id]
        );
      } else {
        result = await pool.query(
          `UPDATE bills SET admin_status=$1, admin_comment=$2, admin_reviewed_at=NOW(), admin_reviewer_id=$3, manager_reviewer_id=$4, current_stage=$5
           WHERE id=$6 RETURNING *`,
          [action, comment || null, actorId, assignedManager, nextStage, id]
        );
      }
    } else if (actorRole === 'manager' && bill.current_stage === 'manager_review') {
      // Manager final action
      result = await pool.query(
        `UPDATE bills SET manager_status=$1, manager_comment=$2, manager_reviewed_at=NOW(), manager_reviewer_id=$3, current_stage='completed'
         WHERE id=$4 RETURNING *`,
        [action, comment || null, actorId, id]
      );
    } else {
      return res.status(400).json({
        success: false,
        message: `Cannot perform ${actorRole} action — bill is at '${bill.current_stage}' stage`
      });
    }

    console.log(`✅ [billAction] ${actorRole} ${action} bill ${id}`);
    return res.json({ success: true, message: `Bill ${action}`, data: result.rows[0] });
  } catch (error) {
    console.error("❌ Bill action error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────
// 7. GET /bills/manager  —  Manager sees bills at manager_review stage
// ──────────────────────────────────────────
exports.getManagerBills = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, u.name AS employee_name, u.email AS employee_email
       FROM bills b
       JOIN users u ON u.id = b.user_id
       WHERE u.company_id = $1
         AND b.manager_reviewer_id = $2
       ORDER BY b.created_at DESC`,
       [req.user.company_id, req.user.id]
    );

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("❌ Get manager bills error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────
// 8. PATCH /bills/manager/:id  —  Manager approves or rejects (final)
// ──────────────────────────────────────────
exports.managerAction = async (req, res) => {
  const { id } = req.params;
  const { action, comment } = req.body; // action: 'approved' | 'rejected'
  const managerId = req.user.id;

  if (!["approved", "rejected"].includes(action)) {
    return res.status(400).json({ success: false, message: "Action must be 'approved' or 'rejected'" });
  }

  try {
    // Verify bill is at manager_review stage and belongs to same company
    const billCheck = await pool.query(
        "SELECT b.*, u.company_id FROM bills b JOIN users u ON u.id = b.user_id WHERE b.id = $1", 
        [id]
    );

    if (billCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }

    const bill = billCheck.rows[0];
    
    if (bill.company_id !== req.user.company_id) {
      return res.status(403).json({ success: false, message: "Unauthorized access to bill" });
    }

    if (bill.current_stage !== "manager_review") {
      return res.status(400).json({
        success: false,
        message: `Cannot perform manager action — bill is at '${bill.current_stage}' stage`,
      });
    }

    const result = await pool.query(
      `UPDATE bills
       SET manager_status = $1,
           manager_comment = $2,
           manager_reviewed_at = NOW(),
           manager_reviewer_id = $3,
           current_stage = 'completed'
       WHERE id = $4
       RETURNING *`,
      [action, comment || null, managerId, id]
    );

    console.log(`✅ Manager ${action} bill ${id} → completed`);

    return res.json({
      success: true,
      message: `Bill ${action} by manager (final)`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Manager action error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────
// 9. GET /bills/my  —  Employee sees their own bills
// ──────────────────────────────────────────
exports.getMyBills = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM bills WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("❌ Get my bills error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────
// 10. POST /bills/scan  —  OCR Scan a receipt image
// ──────────────────────────────────────────
exports.scanReceipt = async (req, res) => {
  try {
    const { receiptUrl } = req.body;
    if (!receiptUrl) {
      return res.status(400).json({ success: false, message: "No receipt URL provided" });
    }

    // Since we're using local storage, receiptUrl is the local path
    const data = await OCRService.scanReceipt(receiptUrl);
    return res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Scan receipt error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ──────────────────────────────────────────
// 11. POST /bills/upload  —  Upload single receipt image via Multer
// ──────────────────────────────────────────
exports.uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const { filename, path: filePath } = req.file;
    return res.json({
      success: true,
      data: {
        filename,
        filePath,
        url: filePath 
      }
    });
  } catch (error) {
    console.error("❌ Upload receipt error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
