const express = require('express');
const { Pedido, PedidoDetalle, Cliente, Producto } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Obtener todos los pedidos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['id', 'nombre']
        },
        {
          model: PedidoDetalle,
          as: 'detalles',
          include: [{
            model: Producto,
            as: 'producto',
            attributes: ['id', 'nombre', 'precio']
          }]
        }
      ],
      order: [['fecha_pedido', 'DESC']]
    });

    res.json({
      success: true,
      data: pedidos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pedidos',
      error: error.message
    });
  }
});

module.exports = router;
