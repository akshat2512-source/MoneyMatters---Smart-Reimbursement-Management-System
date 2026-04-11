// backend/src/config/plans.js

const plans = {
  FREE: {
    name: "Free",
    price: 0,
    features: {
      maxExpenses: 10,
      batchUpload: false,
      fraudDetection: false,
      analytics: false,
      receiptScan: true,
    }
  },
  PRO: {
    name: "Pro",
    price: 499, // ₹499 INR
    features: {
      maxExpenses: Infinity,
      batchUpload: true,
      fraudDetection: true,
      analytics: true,
      receiptScan: true,
    }
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 1999, // ₹1999 INR
    features: {
      maxExpenses: Infinity,
      batchUpload: true,
      fraudDetection: true,
      analytics: true,
      receiptScan: true,
      multiCompany: true,
      dedicatedSupport: true
    }
  }
};

module.exports = plans;
