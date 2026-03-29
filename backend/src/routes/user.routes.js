const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
// GET /, POST /, PATCH /:id/role, PATCH /:id/manager
module.exports = router;
