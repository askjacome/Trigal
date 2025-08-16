module.exports = (sequelize, DataTypes) => {
  const RutaCliente = sequelize.define('RutaCliente', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ruta_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rutas_ventas',
        key: 'id'
      }
    },
    cliente_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id'
      }
    },
    orden_visita: {
      type: DataTypes.INTEGER
    },
    hora_estimada: {
      type: DataTypes.TIME
    },
    hora_visita: {
      type: DataTypes.DATE
    },
    estado_visita: {
      type: DataTypes.ENUM('Pendiente', 'Visitado', 'No_Visitado'),
      defaultValue: 'Pendiente'
    },
    latitud: {
      type: DataTypes.DECIMAL(10, 8)
    },
    longitud: {
      type: DataTypes.DECIMAL(11, 8)
    },
    observaciones: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'ruta_clientes',
    timestamps: false,
    indexes: [
      {
        fields: ['ruta_id']
      },
      {
        fields: ['cliente_id']
      },
      {
        fields: ['estado_visita']
      }
    ]
  });

  return RutaCliente;
};
