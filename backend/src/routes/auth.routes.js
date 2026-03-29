const express = require('express');
const router = express.Router();

// Signup route
router.post('/signup', (req, res) => {
  res.json({ message: "Signup working ✅" });
});

// Login route
router.post('/login', (req, res) => {
  res.json({ message: "Login working ✅" });
});

// Optional test route
router.get('/', (req, res) => {
  res.send("Auth API working 🚀");
});

module.exports = router;