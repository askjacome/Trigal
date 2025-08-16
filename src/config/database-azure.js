const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración para Azure SQL Database
const sequelize = new Sequelize(
  process.env.AZURE_SQL_DATABASE || 'trigal_crm',
  process.env.AZURE_SQL_USERNAME || 'trigal_admin',
  process.env.AZURE_SQL_PASSWORD,
  {
    host: process.env.AZURE_SQL_SERVER || 'trigal-crm-server.database.windows.net',
    port: parseInt(process.env.AZURE_SQL_PORT) || 1433,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: true, // Requerido para Azure SQL
        trustServerCertificate: false,
        enableArithAbort: true,
        instanceName: process.env.AZURE_SQL_INSTANCE,
        connectionTimeout: 30000,
        requestTimeout: 60000
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a Azure SQL Database establecida correctamente.');
    
    // Log de información de conexión (sin mostrar credenciales)
    console.log(`🗄️  Servidor: ${process.env.AZURE_SQL_SERVER}`);
    console.log(`📊 Base de datos: ${process.env.AZURE_SQL_DATABASE}`);
    console.log(`👤 Usuario: ${process.env.AZURE_SQL_USERNAME}`);
  } catch (error) {
    console.error('❌ Error al conectar con Azure SQL Database:', error.message);
    
    // Información adicional para troubleshooting
    if (error.code === 'ELOGIN') {
      console.error('💡 Verifica las credenciales de Azure SQL Database');
    } else if (error.code === 'ESOCKET') {
      console.error('💡 Verifica la configuración del firewall de Azure SQL');
    }
    
    throw error;
  }
};

// Función para sincronizar modelos (solo en desarrollo)
const syncDatabase = async (force = false) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force });
      console.log('🔄 Base de datos sincronizada correctamente.');
    }
  } catch (error) {
    console.error('❌ Error al sincronizar base de datos:', error);
    throw error;
  }
};

module.exports = { 
  sequelize, 
  testConnection, 
  syncDatabase 
};
