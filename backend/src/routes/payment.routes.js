// backend/src/routes/payment.routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const paymentController = require('../controllers/payment.controller');

router.post('/create-order', authenticate, paymentController.createOrder);
router.post('/verify', authenticate, paymentController.verifyPayment);

module.exports = router;
