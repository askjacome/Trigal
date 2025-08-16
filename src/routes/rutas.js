const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Placeholder para rutas de ventas en campo
router.get('/', authenticateToken, async (req, res) => {
  res.json({
    success: true,
    message: 'Módulo de rutas en desarrollo',
    data: []
  });
});

module.exports = router;
