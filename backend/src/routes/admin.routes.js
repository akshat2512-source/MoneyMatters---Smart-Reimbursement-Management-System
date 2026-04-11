const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

// All admin routes require authentication and admin role
router.use(authenticate, isAdmin);

// ✅ 1. Get pending users for approval
router.get('/pending-users', adminController.getPendingUsers);

// ✅ 2. Approve a user
router.post('/approve/:userId', adminController.approveUser);

// ✅ 3. Reject a user
router.post('/reject/:userId', adminController.rejectUser);

module.exports = router;
