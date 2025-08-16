const express = require('express');
const { Producto } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Obtener todos los productos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: { activo: true },
      order: [['nombre', 'ASC']]
    });

    res.json({
      success: true,
      data: productos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
});

// Crear nuevo producto
router.post('/', authenticateToken, async (req, res) => {
  try {
    const producto = await Producto.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: producto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
});

module.exports = router;
