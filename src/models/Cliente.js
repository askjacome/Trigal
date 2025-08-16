module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [2, 200]
      }
    },
    razon_social: {
      type: DataTypes.STRING(200)
    },
    rfc: {
      type: DataTypes.STRING(20),
      validate: {
        len: [12, 13]
      }
    },
    direccion: {
      type: DataTypes.TEXT
    },
    telefono: {
      type: DataTypes.STRING(20)
    },
    email: {
      type: DataTypes.STRING(100),
      validate: {
        isEmail: true
      }
    },
    vendedor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    condiciones_pago: {
      type: DataTypes.STRING(50),
      defaultValue: 'Contado'
    },
    estado: {
      type: DataTypes.ENUM('Activo', 'Inactivo', 'Suspendido'),
      defaultValue: 'Activo'
    },
    region: {
      type: DataTypes.STRING(50)
    },
    limite_credito: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    }
  }, {
    tableName: 'clientes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['vendedor_id']
      },
      {
        fields: ['estado']
      },
      {
        fields: ['region']
      },
      {
        unique: true,
        fields: ['rfc']
      }
    ]
  });

  return Cliente;
};
