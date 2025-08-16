const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const appInsights = require('applicationinsights');
require('dotenv').config();

// Configurar Application Insights para Azure
if (process.env.AZURE_APPLICATION_INSIGHTS_CONNECTION_STRING) {
    appInsights.setup(process.env.AZURE_APPLICATION_INSIGHTS_CONNECTION_STRING)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true)
        .setUseDiskRetryCaching(true)
        .setSendLiveMetrics(false)
        .start();
}

const app = express();
const PORT = process.env.PORT || 8080; // Azure usa puerto 8080 por defecto

// Configuración específica para Azure
app.set('trust proxy', 1); // Confiar en proxy de Azure

// Middleware de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https:"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"]
        }
    }
}));

app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        'https://trigal-crm.azurewebsites.net',
        'http://localhost:3000', // Para desarrollo
        'https://localhost:3000'
    ],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Rate limiting específico para Azure
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 200, // Mayor límite para Azure
    message: {
        success: false,
        message: 'Demasiadas peticiones desde esta IP, intenta más tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/', limiter);

// Middleware general
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check para Azure
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0'
    });
});

// Ruta de información de la aplicación
app.get('/info', (req, res) => {
    res.json({
        name: 'CRM Trigal',
        version: '2.0.0',
        description: 'Sistema CRM especializado en productos de maíz',
        environment: process.env.NODE_ENV,
        database: 'Azure SQL Server',
        platform: 'Microsoft Azure'
    });
});

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname)));

// Rutas de la API (usando try-catch para manejo de errores en Azure)
try {
    app.use('/api/auth', require('./src/routes/auth'));
    app.use('/api/users', require('./src/routes/users'));
    app.use('/api/clientes', require('./src/routes/clientes'));
    app.use('/api/productos', require('./src/routes/productos'));
    app.use('/api/pedidos', require('./src/routes/pedidos'));
    app.use('/api/ventas', require('./src/routes/ventas'));
    app.use('/api/rutas', require('./src/routes/rutas'));
    app.use('/api/reportes', require('./src/routes/reportes'));
} catch (error) {
    console.error('Error al cargar rutas:', error);
}

// Ruta para servir el frontend (debe ir después de las rutas API)
app.get('*', (req, res) => {
    // Solo servir index.html para rutas que no son API
    if (!req.url.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.status(404).json({
            success: false,
            message: 'Endpoint de API no encontrado'
        });
    }
});

// Middleware de manejo de errores específico para Azure
app.use((err, req, res, next) => {
    // Log del error para Application Insights
    if (appInsights.defaultClient) {
        appInsights.defaultClient.trackException({ exception: err });
    }
    
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Error interno del servidor' 
            : err.message,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Middleware para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.path
    });
});

// Inicializar servidor
const server = app.listen(PORT, () => {
    console.log(`🌽 CRM Trigal ejecutándose en Azure`);
    console.log(`📊 Puerto: ${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Base de datos: Azure SQL Server`);
    console.log(`⏰ Iniciado: ${new Date().toISOString()}`);
    
    // Test de conexión a base de datos
    if (process.env.NODE_ENV !== 'test') {
        require('./src/config/database-azure').testConnection();
    }
});

// Manejo graceful de cierre
process.on('SIGTERM', () => {
    console.log('🛑 Señal SIGTERM recibida, cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 Señal SIGINT recibida, cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});

module.exports = app;
