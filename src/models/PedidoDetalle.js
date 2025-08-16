module.exports = (sequelize, DataTypes) => {
  const PedidoDetalle = sequelize.define('PedidoDetalle', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pedido_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'pedidos',
        key: 'id'
      }
    },
    producto_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id'
      }
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    }
  }, {
    tableName: 'pedido_detalles',
    timestamps: false,
    indexes: [
      {
        fields: ['pedido_id']
      },
      {
        fields: ['producto_id']
      }
    ]
  });

  return PedidoDetalle;
};
