const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Placeholder para reportes
router.get('/', authenticateToken, async (req, res) => {
  res.json({
    success: true,
    message: 'Módulo de reportes en desarrollo',
    data: []
  });
});

module.exports = router;
