const express = require("express");
const router = express.Router();
const { authenticate, checkApprovedUser } = require("../middleware/auth.middleware");
const { isAdmin, isManager, isEmployee } = require("../middleware/role.middleware");
const billController = require("../controllers/bill.controller");
const upload = require("../middleware/multer");

// Apply approval check to all bill routes
router.use(authenticate, checkApprovedUser);

// ── Diagnostic ──
router.get("/test", (req, res) => res.json({ message: "Bill routes are active" }));

// ── Employee: single bill creation ──
router.post("/create",  authenticate, isEmployee, billController.createBill);
router.get("/my",       authenticate, billController.getMyBills);
router.post("/upload",  authenticate, isEmployee, upload.single('receipt'), billController.uploadReceipt);
router.post("/scan",    authenticate, isEmployee, billController.scanReceipt);

const { checkFeatureAccess } = require("../middleware/featureGate.js");

// ── Employee: batch upload (up to 6 receipts) ──
router.post(
  "/batch-upload",
  authenticate,
  isEmployee,
  checkFeatureAccess('batchUpload'),
  upload.array('files', 6),  // multer handles max-6 + 5MB per file
  billController.batchUpload
);


// ── Admin: view all bills & batch groups ──
router.get("/admin",           authenticate, isAdmin, billController.getAdminBills);
router.get("/admin/batches",   authenticate, isAdmin, billController.getBatchedBills);
router.patch("/admin/:id",     authenticate, isAdmin, billController.adminAction);

// ── Manager: view & approve/reject ──
router.get("/manager",         authenticate, isManager, billController.getManagerBills);
router.patch("/manager/:id",   authenticate, isManager, billController.managerAction);

// ── Unified action endpoint (spec: PUT /expenses/:id/action) ──
// Handles both admin and manager actions — roles checked inside controller
router.put("/:id/action", authenticate, billController.billAction);

module.exports = router;
