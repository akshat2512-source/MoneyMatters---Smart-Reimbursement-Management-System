// backend/src/middleware/featureGate.js
const plans = require('../config/plans');

/**
 * Middleware to check if the user has access to a specific feature based on their plan.
 * @param {string} featureName - The name of the feature to check (e.g., 'batchUpload', 'fraudDetection')
 */
const checkFeatureAccess = (featureName) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Check plan expiry
    const now = new Date();
    const expiryDate = user.plan_expiry ? new Date(user.plan_expiry) : null;
    
    // Default to FREE if expired or no plan set
    let activePlan = user.plan || 'FREE';
    if (activePlan !== 'FREE' && expiryDate && now > expiryDate) {
      console.log(`Plan ${activePlan} for user ${user.id} has expired. Falling back to FREE.`);
      activePlan = 'FREE';
    }

    const planConfig = plans[activePlan];
    if (!planConfig) {
      return res.status(500).json({ success: false, message: "Invalid plan configuration" });
    }

    const hasAccess = planConfig.features[featureName];

    if (hasAccess === true || (typeof hasAccess === 'number' && hasAccess > 0)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `The ${featureName} feature is not available on your ${activePlan} plan. Upgrade to PRO to unlock advanced features!`,
      upgradeRequired: true
    });
  };
};

module.exports = {
  checkFeatureAccess
};
