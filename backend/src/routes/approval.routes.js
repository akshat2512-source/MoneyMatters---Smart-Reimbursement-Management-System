const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
// GET /pending, POST /:id/decide
module.exports = router;
