module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('Producto', {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true
    },
    sku: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [2, 200]
      }
    },
    categoria: {
      type: DataTypes.STRING(100)
    },
    marca: {
      type: DataTypes.STRING(100)
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    precio_original: {
      type: DataTypes.DECIMAL(10, 2)
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    stock_minimo: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      validate: {
        min: 0
      }
    },
    descripcion: {
      type: DataTypes.TEXT
    },
    especificaciones: {
      type: DataTypes.JSON
    },
    imagenes: {
      type: DataTypes.JSON
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'productos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['sku']
      },
      {
        fields: ['categoria']
      },
      {
        fields: ['activo']
      },
      {
        fields: ['stock']
      }
    ]
  });

  return Producto;
};
