module.exports = (sequelize, DataTypes) => {
  const Pedido = sequelize.define('Pedido', {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true
    },
    cliente_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      }
    },
    vendedor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    fecha_pedido: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    fecha_entrega: {
      type: DataTypes.DATEONLY
    },
    estado: {
      type: DataTypes.ENUM('Pendiente', 'Procesando', 'Entregado', 'Cancelado'),
      defaultValue: 'Pendiente'
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    impuestos: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    observaciones: {
      type: DataTypes.TEXT
    },
    direccion_entrega: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'pedidos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['cliente_id']
      },
      {
        fields: ['vendedor_id']
      },
      {
        fields: ['estado']
      },
      {
        fields: ['fecha_pedido']
      }
    ]
  });

  return Pedido;
};
