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
router.post("/create",  isEmployee, billController.createBill);
router.get("/my",       billController.getMyBills);
router.post("/upload",  isEmployee, upload.single('receipt'), billController.uploadReceipt);
router.post("/scan",    isEmployee, billController.scanReceipt);

const { checkFeatureAccess } = require("../middleware/featureGate.js");

// ── Employee: batch upload (up to 6 receipts) ──
router.post(
  "/batch-upload",
  isEmployee,
  checkFeatureAccess('batchUpload'),
  upload.array('files', 6),  // multer handles max-6 + 5MB per file
  billController.batchUpload
);


// ── Admin: view all bills & batch groups ──
router.get("/admin",           isAdmin, billController.getAdminBills);
router.get("/admin/batches",   isAdmin, billController.getBatchedBills);
router.patch("/admin/:id",     isAdmin, billController.adminAction);

// ── Manager: view & approve/reject ──
router.get("/manager",         isManager, billController.getManagerBills);
router.patch("/manager/:id",   isManager, billController.managerAction);

// ── Unified action endpoint (spec: PUT /expenses/:id/action) ──
// Handles both admin and manager actions — roles checked inside controller
router.put("/:id/action", billController.billAction);

module.exports = router;
