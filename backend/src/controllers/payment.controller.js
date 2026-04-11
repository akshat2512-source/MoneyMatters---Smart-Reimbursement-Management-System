// backend/src/controllers/payment.controller.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const pool = require('../config/db');
const plans = require('../config/plans');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  const { planType } = req.body;
  const plan = plans[planType];

  if (!plan || planType === 'FREE') {
    return res.status(400).json({ success: false, message: "Invalid plan type" });
  }

  try {
    const receiptId = `order_${Date.now().toString().slice(-8)}_${req.user.id.split('-')[0]}`.substring(0, 40);
    
    console.log('--- Razorpay Order Debug ---');
    console.log('Receipt ID:', receiptId);
    console.log('Amount (Paise):', plan.price * 100);
    console.log('---------------------------');

    const options = {
      amount: plan.price * 100, // Razorpay expects amount in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: receiptId,
      notes: {
        user_id: req.user.id,
        plan_type: planType,
      }
    };


    const order = await razorpay.orders.create(options);
    
    // Store order ID in DB for verification later
    await pool.query(
      'UPDATE users SET razorpay_order_id = $1 WHERE id = $2',
      [order.id, req.user.id]
    );

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Razorpay Order Creation Error:', err);
    res.status(500).json({ success: false, message: "Failed to create payment order" });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType } = req.body;

  try {
    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // 2. Update User Plan
    // Plan duration = 30 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const result = await pool.query(
      `UPDATE users 
       SET plan = $1, 
           plan_expiry = $2, 
           razorpay_subscription_id = $3,
           razorpay_order_id = NULL
       WHERE id = $4
       RETURNING id, name, email, role, company_id, plan, plan_expiry`,
      [planType, expiryDate, razorpay_payment_id, req.user.id]
    );

    res.json({
      success: true,
      message: "Payment verified and plan upgraded successfully",
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Payment Verification Error:', err);
    res.status(500).json({ success: false, message: "Failed to verify payment" });
  }
};
