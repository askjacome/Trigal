module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      validate: {
        len: [3, 50],
        isAlphanumeric: true
      }
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    rol: {
      type: DataTypes.ENUM('admin', 'vendedor', 'supervisor', 'cliente'),
      allowNull: false,
      defaultValue: 'vendedor'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    ultimo_acceso: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['username']
      },
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['rol']
      }
    ]
  });

  return User;
};
