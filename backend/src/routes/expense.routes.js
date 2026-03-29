const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
// POST /, GET /my, GET /team
module.exports = router;
