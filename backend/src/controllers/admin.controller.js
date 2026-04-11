const pool = require("../config/db");

// ✅ 1. GET /api/admin/pending-users
// Fetch all users with status 'pending' in the admin's company
exports.getPendingUsers = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const result = await pool.query(
      "SELECT id, name, email, role, created_at, status FROM users WHERE company_id = $1 AND status = 'pending' ORDER BY created_at DESC",
      [companyId]
    );

    return res.json({ 
      success: true, 
      count: result.rows.length,
      data: result.rows 
    });
  } catch (error) {
    console.error("❌ Get pending users error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ 2. POST /api/admin/approve/:userId
exports.approveUser = async (req, res) => {
  const { userId } = req.params;
  const adminId = req.user.id;
  const companyId = req.user.company_id;

  try {
    // Ensure the user exists and belongs to the same company
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1 AND company_id = $2",
      [userId, companyId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found or belongs to another company" });
    }

    const result = await pool.query(
      `UPDATE users 
       SET status = 'approved', approved_by = $1, approved_at = NOW() 
       WHERE id = $2 
       RETURNING id, name, email, status`,
      [adminId, userId]
    );

    return res.json({ 
      success: true, 
      message: "User approved successfully", 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error("❌ Approve user error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ 3. POST /api/admin/reject/:userId
exports.rejectUser = async (req, res) => {
  const { userId } = req.params;
  const companyId = req.user.company_id;

  try {
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1 AND company_id = $2",
      [userId, companyId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const result = await pool.query(
      "UPDATE users SET status = 'rejected' WHERE id = $1 RETURNING id, name, status",
      [userId]
    );

    return res.json({ 
      success: true, 
      message: "User registration rejected", 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error("❌ Reject user error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
