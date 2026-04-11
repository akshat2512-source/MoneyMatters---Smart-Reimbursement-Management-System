const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, checkApprovedUser } = require('../middleware/auth.middleware');

router.use(authenticate, checkApprovedUser);

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.patch('/:id/manager', userController.assignManager);

module.exports = router;
