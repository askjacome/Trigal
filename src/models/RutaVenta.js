module.exports = (sequelize, DataTypes) => {
  const RutaVenta = sequelize.define('RutaVenta', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    vendedor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    fecha_ruta: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('Planificada', 'En_Progreso', 'Completada', 'Cancelada'),
      defaultValue: 'Planificada'
    },
    observaciones: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'rutas_ventas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['vendedor_id']
      },
      {
        fields: ['fecha_ruta']
      },
      {
        fields: ['estado']
      }
    ]
  });

  return RutaVenta;
};
