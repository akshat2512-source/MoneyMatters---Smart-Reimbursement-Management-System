const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Use bcryptjs (pure JS) — native bcrypt often fails on Windows
const pool = require("../config/db");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ CREATE COMPANY (Admin Flow)
exports.createCompany = async (req, res) => {
  const { name, email, password, companyName } = req.body;

  if (!name || !email || !password || !companyName) {
    return res.status(400).json({ message: "Name, email, password, and companyName are required" });
  }

  try {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let inviteCode = '';
    const randomBytes = crypto.randomBytes(8);
    for (let i = 0; i < 8; i++) {
      inviteCode += chars[randomBytes[i] % chars.length];
    }

    const companyResult = await pool.query(
      "INSERT INTO companies (name, country, currency_code, invite_code) VALUES ($1, $2, $3, $4) RETURNING id, plan, plan_expiry",
      [companyName, "Unknown", "USD", inviteCode]
    );
    const company = companyResult.rows[0];
    const companyId = company.id;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      "INSERT INTO users (name, email, password_hash, role, company_id, status) VALUES ($1, $2, $3, $4, $5, 'approved') RETURNING id, name, email, role, company_id",
      [name, email, hashedPassword, 'admin', companyId]
    );
    const user = userResult.rows[0];

    const token = jwt.sign(
      { id: user.id, role: user.role, company_id: user.company_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Company created successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role, inviteCode, plan: company.plan, plan_expiry: company.plan_expiry },
      token,
    });
  } catch (error) {
    console.error("❌ Create company error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ JOIN COMPANY (Employee/Manager Flow)
exports.joinCompany = async (req, res) => {
  const { name, email, password, role, inviteCode } = req.body;

  if (!name || !email || !password || !inviteCode) {
    return res.status(400).json({ message: "Name, email, password, and inviteCode are required" });
  }

  const normalizedRole = (role || "employee").toLowerCase();
  if (!["manager", "employee"].includes(normalizedRole)) {
    return res.status(400).json({ message: "Invalid role for joining. Must be manager or employee." });
  }

  try {
    const normalizedCode = inviteCode.trim().toUpperCase();
    const companyResult = await pool.query("SELECT id FROM companies WHERE invite_code = $1", [normalizedCode]);
    if (companyResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid invite code" });
    }
    const companyId = companyResult.rows[0].id;

    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1 AND company_id = $2", [email, companyId]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User with this email already exists in this company" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      "INSERT INTO users (name, email, password_hash, role, company_id, status) VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING id, name, email, role, company_id, status",
      [name, email, hashedPassword, normalizedRole, companyId]
    );
    const user = userResult.rows[0];

    return res.json({
      message: "Registration successful. Your account is pending admin approval.",
      user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (error) {
    console.error("❌ Join company error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await pool.query(
      `SELECT u.*, c.invite_code, c.plan, c.plan_expiry 
       FROM users u 
       LEFT JOIN companies c ON u.company_id = c.id 
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found. Please sign up first." });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (user.status !== 'approved') {
      return res.status(403).json({ 
        message: `Your account is currently ${user.status}. Please contact an administrator for approval.`,
        status: user.status
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, company_id: user.company_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        inviteCode: user.invite_code, // Provide inviteCode for frontend
        plan: user.plan,
        plan_expiry: user.plan_expiry
      },
      token,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ GOOGLE LOGIN
exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Google token is required" });
  }

  try {
    // 1. Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // 2. Check if user exists by email
    const userResult = await pool.query(
      `SELECT u.*, c.invite_code, c.plan, c.plan_expiry 
       FROM users u 
       LEFT JOIN companies c ON u.company_id = c.id 
       WHERE u.email = $1`,
      [email]
    );

    let user;

    if (userResult.rows.length > 0) {
      user = userResult.rows[0];
      // Sync Google ID and Picture
      await pool.query(
        "UPDATE users SET google_id = $1, profile_picture = $2 WHERE id = $3",
        [googleId, picture, user.id]
      );
    } else {
      // 3. New User - Auto Create Company
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let inviteCode = '';
      const randomBytes = crypto.randomBytes(8);
      for (let i = 0; i < 8; i++) {
        inviteCode += chars[randomBytes[i] % chars.length];
      }

      const companyName = `${name}'s Workspace`;
      const companyResult = await pool.query(
        "INSERT INTO companies (name, country, currency_code, invite_code) VALUES ($1, $2, $3, $4) RETURNING id, plan, plan_expiry",
        [companyName, "Unknown", "USD", inviteCode]
      );
      const company = companyResult.rows[0];
      const companyId = company.id;

      // 4. Create User as Admin
      const newUserResult = await pool.query(
        "INSERT INTO users (name, email, role, company_id, status, google_id, profile_picture) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, role, company_id",
        [name, email, 'admin', companyId, 'approved', googleId, picture]
      );
      user = newUserResult.rows[0];
      user.invite_code = inviteCode;
      user.plan = company.plan;
      user.plan_expiry = company.plan_expiry;
    }

    // 5. Generate JWT
    const jwtToken = jwt.sign(
      { id: user.id, role: user.role, company_id: user.company_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Google login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        inviteCode: user.invite_code,
        plan: user.plan,
        plan_expiry: user.plan_expiry
      },
      token: jwtToken,
    });
  } catch (error) {
    console.error("❌ Google login error:", error);
    return res.status(401).json({ message: "Invalid Google token" });
  }
};
