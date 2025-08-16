const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'trigal_crm',
  process.env.DB_USER || 'trigal_user',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente.');
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error);
  }
};

module.exports = { sequelize, testConnection };
