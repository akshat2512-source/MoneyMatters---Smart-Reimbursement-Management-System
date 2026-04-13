const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id || !decoded.company_id) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const checkApprovedUser = async (req, res, next) => {
  const pool = require('../config/db');
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT u.status, c.plan, c.plan_expiry 
       FROM users u 
       LEFT JOIN companies c ON u.company_id = c.id 
       WHERE u.id = $1`, 
      [userId]
    );

    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { status, plan, plan_expiry } = result.rows[0];
    if (status !== 'approved') {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied: Your account is currently '${status}'. Please contact an administrator.` 
      });
    }

    // Merge plan data into req.user
    req.user.plan = plan;
    req.user.plan_expiry = plan_expiry;


    next();
  } catch (error) {
    console.error("Check Approved User Error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  authenticate,
  checkApprovedUser
};