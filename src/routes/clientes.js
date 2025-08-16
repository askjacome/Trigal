const express = require('express');
const { Cliente, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Obtener todos los clientes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      include: [{
        model: User,
        as: 'vendedor',
        attributes: ['id', 'nombre', 'apellido']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: clientes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener clientes',
      error: error.message
    });
  }
});

// Crear nuevo cliente
router.post('/', authenticateToken, async (req, res) => {
  try {
    const cliente = await Cliente.create({
      ...req.body,
      vendedor_id: req.body.vendedor_id || req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente',
      data: cliente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear cliente',
      error: error.message
    });
  }
});

// Obtener cliente por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'vendedor',
        attributes: ['id', 'nombre', 'apellido']
      }]
    });

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    res.json({
      success: true,
      data: cliente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener cliente',
      error: error.message
    });
  }
});

module.exports = router;
