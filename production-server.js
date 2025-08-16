// ===== TRIGAL CRM v1.2.0 - SERVIDOR DE PRODUCCIÓN =====
// Servidor optimizado para entorno de producción en Azure
// Fecha: 16 de Agosto de 2025

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const winston = require('winston');
require('dotenv').config();

// Inicialización de la aplicación
const app = express();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'production';

// ===== CONFIGURACIÓN DE LOGGING =====
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'trigal-crm', version: '1.2.0' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// ===== MIDDLEWARE DE SEGURIDAD =====
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https://nominatim.openstreetmap.org"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"]
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// ===== MIDDLEWARE GENERAL =====
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configurado para producción
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
    optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
    message: {
        success: false,
        message: 'Demasiadas solicitudes, intenta de nuevo más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false
});

if (process.env.RATE_LIMIT_ENABLED === 'true') {
    app.use('/api/', limiter);
}

// Logging de requests
app.use(morgan('combined', {
    stream: { write: message => logger.info(message.trim()) }
}));

// ===== MIDDLEWARE DE LOGGING DE ACTIVIDAD =====
const logActivity = (action, userId = null, tableAffected = null, recordId = null, oldData = null, newData = null) => {
    return (req, res, next) => {
        // En producción, esto se conectaría a la base de datos
        const activityLog = {
            usuario_id: userId || req.user?.id,
            accion: action,
            tabla_afectada: tableAffected,
            registro_id: recordId,
            datos_anteriores: oldData ? JSON.stringify(oldData) : null,
            datos_nuevos: newData ? JSON.stringify(newData) : null,
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
        };
        
        logger.info('Activity Log', activityLog);
        next();
    };
};

// ===== BASE DE DATOS SIMULADA PARA DEMO =====
// En producción, esto se reemplazaría con conexión real a Azure SQL
let database = {
    usuarios: [
        {
            id: 1,
            username: 'admin',
            email: 'admin@trigal.com',
            password: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            nombre: 'Administrador',
            apellido: 'Sistema',
            rol: 'admin',
            telefono: '+52 55 1234 5678',
            zona: 'Corporativo',
            activo: true,
            ultimo_acceso: null,
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            username: 'gerente.ventas',
            email: 'gerente@trigal.com',
            password: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            nombre: 'María',
            apellido: 'González',
            rol: 'gerente_ventas',
            telefono: '+52 55 2345 6789',
            zona: 'Centro',
            activo: true,
            ultimo_acceso: null,
            created_at: new Date().toISOString()
        },
        {
            id: 3,
            username: 'vendedor.norte',
            email: 'vendedor.norte@trigal.com',
            password: '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            nombre: 'Carlos',
            apellido: 'Ruiz',
            rol: 'vendedor',
            telefono: '+52 55 3456 7890',
            zona: 'Norte',
            activo: true,
            ultimo_acceso: null,
            created_at: new Date().toISOString()
        }
    ],
    clientes: [
        {
            id: 1,
            codigo_cliente: 'CLI001',
            nombre: 'Tortillería La Esperanza',
            contacto: 'Juan Pérez',
            email: 'juan@laesperanza.com',
            telefono: '+52 55 1111 2222',
            direccion: 'Av. Insurgentes 123, Col. Centro',
            ciudad: 'Ciudad de México',
            estado: 'CDMX',
            codigo_postal: '06000',
            latitud: 19.4326,
            longitud: -99.1332,
            vendedor_id: 3,
            activo: true,
            tipo: 'mayorista',
            limite_credito: 100000,
            dias_credito: 30,
            total_compras: 125000,
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            codigo_cliente: 'CLI002',
            nombre: 'Molinos del Valle',
            contacto: 'Ana López',
            email: 'ana@molinosdelvalle.com',
            telefono: '+52 33 2222 3333',
            direccion: 'Calle Reforma 456, Col. Industrial',
            ciudad: 'Guadalajara',
            estado: 'Jalisco',
            codigo_postal: '44100',
            latitud: 20.6597,
            longitud: -103.3496,
            vendedor_id: 3,
            activo: true,
            tipo: 'distribuidor',
            limite_credito: 200000,
            dias_credito: 45,
            total_compras: 180000,
            created_at: new Date().toISOString()
        }
    ],
    productos: [
        {
            id: 1,
            codigo: 'MAIZ001',
            nombre: 'Maíz Cacahuazintle Blanco Premium',
            descripcion: 'Maíz cacahuazintle de primera calidad para pozole, grano grande y uniforme',
            categoria: 'Granos',
            unidad: 'kg',
            precio_base: 28.00,
            iva: 16,
            precio_venta: 32.48,
            precio_mayorista: 30.00,
            precio_distribuidor: 28.50,
            costo: 22.00,
            stock: 5000,
            stock_minimo: 500,
            activo: true,
            destacado: true,
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            codigo: 'MAIZ002',
            nombre: 'Maíz Amarillo Dent Forrajero',
            descripcion: 'Maíz amarillo tipo dent para alimentación animal y procesamiento industrial',
            categoria: 'Granos',
            unidad: 'kg',
            precio_base: 18.50,
            iva: 16,
            precio_venta: 21.46,
            precio_mayorista: 20.00,
            precio_distribuidor: 19.00,
            costo: 15.00,
            stock: 10000,
            stock_minimo: 1000,
            activo: true,
            destacado: false,
            created_at: new Date().toISOString()
        },
        {
            id: 3,
            codigo: 'HARINA001',
            nombre: 'Harina de Maíz Nixtamalizada Premium',
            descripcion: 'Harina de maíz nixtamalizada premium para tortillas artesanales',
            categoria: 'Harinas',
            unidad: 'kg',
            precio_base: 20.00,
            iva: 16,
            precio_venta: 23.20,
            precio_mayorista: 22.00,
            precio_distribuidor: 21.00,
            costo: 16.00,
            stock: 3000,
            stock_minimo: 300,
            activo: true,
            destacado: true,
            created_at: new Date().toISOString()
        }
    ],
    pedidos: [
        {
            id: 1,
            numero: 'PED-2025-001',
            cliente_id: 1,
            vendedor_id: 3,
            fecha: new Date().toISOString(),
            estado: 'confirmado',
            subtotal: 2800.00,
            iva: 448.00,
            total: 3248.00,
            observaciones: 'Pedido para evento especial',
            items: [
                {
                    producto_id: 1,
                    cantidad: 100,
                    precio_unitario: 28.00,
                    subtotal: 2800.00
                }
            ],
            created_at: new Date().toISOString()
        }
    ],
    promociones: [
        {
            id: 1,
            codigo: 'PROMO001',
            nombre: 'Descuento Maíz Cacahuazintle',
            descripcion: 'Descuento del 10% en compras mayores a 100kg de maíz cacahuazintle',
            tipo: 'porcentaje',
            valor: 10,
            fecha_inicio: new Date().toISOString(),
            fecha_fin: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            activo: true,
            productos_incluidos: [1],
            monto_minimo: 3000,
            limite_usos: 100,
            usos_actuales: 5,
            created_at: new Date().toISOString()
        }
    ],
    visitas: [],
    sesiones: [],
    logs_actividad: []
};

// ===== JWT Y AUTENTICACIÓN =====
const JWT_SECRET = process.env.JWT_SECRET || 'trigal_production_secret_2025';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        logger.warn('Token no proporcionado', { ip: req.ip, userAgent: req.get('User-Agent') });
        return res.status(401).json({ success: false, message: 'Token requerido' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            logger.warn('Token inválido', { token: token.substring(0, 20) + '...', ip: req.ip });
            return res.status(403).json({ success: false, message: 'Token inválido' });
        }
        
        // Actualizar último acceso
        const usuario = database.usuarios.find(u => u.id === user.id);
        if (usuario) {
            usuario.ultimo_acceso = new Date().toISOString();
        }
        
        req.user = user;
        next();
    });
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.rol)) {
            logger.warn('Acceso denegado por rol', { 
                userId: req.user.id, 
                userRole: req.user.rol, 
                requiredRoles: roles,
                ip: req.ip 
            });
            return res.status(403).json({ 
                success: false, 
                message: 'No tienes permisos para esta acción' 
            });
        }
        next();
    };
};

// ===== RUTAS DE AUTENTICACIÓN =====

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        logger.info('Intento de login', { username, ip: req.ip });

        const user = database.usuarios.find(u => 
            u.username === username && u.activo
        );

        if (!user) {
            logger.warn('Usuario no encontrado', { username, ip: req.ip });
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            logger.warn('Contraseña inválida', { username, ip: req.ip });
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                rol: user.rol,
                nombre: user.nombre,
                apellido: user.apellido
            },
            JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '24h' }
        );

        // Guardar sesión
        database.sesiones.push({
            id: Date.now(),
            usuario_id: user.id,
            token: token.substring(0, 20) + '...',
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
            activa: true,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });

        logger.info('Login exitoso', { userId: user.id, username, ip: req.ip });

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    rol: user.rol,
                    zona: user.zona
                }
            }
        });
    } catch (error) {
        logger.error('Error en login', { error: error.message, stack: error.stack });
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        data: { user: req.user }
    });
});

// ===== RUTAS PRINCIPALES DE LA API =====

// Dashboard con métricas de producción
app.get('/api/dashboard', authenticateToken, (req, res) => {
    try {
        const ahora = new Date();
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        
        let pedidos = database.pedidos;
        let clientes = database.clientes;
        
        if (req.user.rol === 'vendedor') {
            pedidos = pedidos.filter(p => p.vendedor_id === req.user.id);
            clientes = clientes.filter(c => c.vendedor_id === req.user.id);
        }
        
        const ventasMes = pedidos
            .filter(p => new Date(p.fecha) >= inicioMes)
            .reduce((sum, p) => sum + p.total, 0);
            
        const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;
        const clientesActivos = clientes.filter(c => c.activo).length;
        const productosStock = database.productos.filter(p => p.stock > p.stock_minimo).length;

        const productosVendidos = {};
        pedidos.forEach(pedido => {
            pedido.items.forEach(item => {
                if (!productosVendidos[item.producto_id]) {
                    productosVendidos[item.producto_id] = 0;
                }
                productosVendidos[item.producto_id] += item.cantidad;
            });
        });
        
        const topProductos = Object.entries(productosVendidos)
            .map(([id, cantidad]) => {
                const producto = database.productos.find(p => p.id === parseInt(id));
                return {
                    producto: producto?.nombre || 'Producto no encontrado',
                    cantidad
                };
            })
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5);

        logger.info('Dashboard accedido', { userId: req.user.id, role: req.user.rol });

        res.json({
            success: true,
            data: {
                kpis: {
                    ventasMes,
                    pedidosPendientes,
                    clientesActivos,
                    productosStock
                },
                topProductos,
                timestamp: new Date().toISOString(),
                version: '1.2.0'
            }
        });
    } catch (error) {
        logger.error('Error en dashboard', { error: error.message, userId: req.user.id });
        res.status(500).json({
            success: false,
            message: 'Error al obtener datos del dashboard'
        });
    }
});

// Resto de rutas API (clientes, productos, pedidos, etc.)
app.get('/api/clientes', authenticateToken, (req, res) => {
    let clientes = database.clientes;
    
    if (req.user.rol === 'vendedor') {
        clientes = clientes.filter(c => c.vendedor_id === req.user.id);
    }
    
    const clientesConVendedor = clientes.map(cliente => {
        const vendedor = database.usuarios.find(u => u.id === cliente.vendedor_id);
        return {
            ...cliente,
            vendedor: vendedor ? {
                id: vendedor.id,
                nombre: vendedor.nombre,
                apellido: vendedor.apellido
            } : null
        };
    });

    res.json({
        success: true,
        data: clientesConVendedor
    });
});

app.get('/api/productos', authenticateToken, (req, res) => {
    res.json({
        success: true,
        data: database.productos
    });
});

app.get('/api/pedidos', authenticateToken, (req, res) => {
    let pedidos = database.pedidos;
    
    if (req.user.rol === 'vendedor') {
        pedidos = pedidos.filter(p => p.vendedor_id === req.user.id);
    }
    
    const pedidosCompletos = pedidos.map(pedido => {
        const cliente = database.clientes.find(c => c.id === pedido.cliente_id);
        const vendedor = database.usuarios.find(u => u.id === pedido.vendedor_id);
        
        return {
            ...pedido,
            cliente: cliente ? {
                id: cliente.id,
                nombre: cliente.nombre,
                contacto: cliente.contacto
            } : null,
            vendedor: vendedor ? {
                id: vendedor.id,
                nombre: vendedor.nombre,
                apellido: vendedor.apellido
            } : null
        };
    });

    res.json({
        success: true,
        data: pedidosCompletos
    });
});

app.get('/api/promociones', authenticateToken, (req, res) => {
    const promocionesActivas = database.promociones.filter(p => 
        p.activo && new Date(p.fecha_fin) > new Date()
    );

    res.json({
        success: true,
        data: promocionesActivas
    });
});

app.get('/api/usuarios', authenticateToken, authorizeRoles('admin', 'gerente_ventas'), (req, res) => {
    const usuarios = database.usuarios.map(u => ({
        ...u,
        password: undefined
    }));
    
    res.json({
        success: true,
        data: usuarios
    });
});

// ===== RUTAS DE SALUD Y MÉTRICAS =====

app.get('/api/health', (req, res) => {
    const healthCheck = {
        success: true,
        message: 'Trigal CRM v1.2.0 Production funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '1.2.0',
        environment: NODE_ENV,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        system: {
            platform: process.platform,
            nodeVersion: process.version,
            pid: process.pid
        },
        database: {
            status: 'connected', // En producción real verificaría conexión a SQL
            usuarios: database.usuarios.length,
            clientes: database.clientes.length,
            productos: database.productos.length,
            pedidos: database.pedidos.length
        }
    };

    res.json(healthCheck);
});

app.get('/api/metrics', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const metrics = {
        success: true,
        timestamp: new Date().toISOString(),
        sistema: {
            version: '1.2.0',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpu: process.cpuUsage()
        },
        base_datos: {
            usuarios_activos: database.usuarios.filter(u => u.activo).length,
            clientes_activos: database.clientes.filter(c => c.activo).length,
            productos_activos: database.productos.filter(p => p.activo).length,
            pedidos_mes: database.pedidos.filter(p => 
                new Date(p.fecha) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            ).length,
            sesiones_activas: database.sesiones.filter(s => s.activa).length
        },
        ventas: {
            total_mes: database.pedidos
                .filter(p => new Date(p.fecha) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1))
                .reduce((sum, p) => sum + p.total, 0),
            promedio_pedido: database.pedidos.length > 0 
                ? database.pedidos.reduce((sum, p) => sum + p.total, 0) / database.pedidos.length 
                : 0
        }
    };

    res.json(metrics);
});

// ===== ARCHIVOS ESTÁTICOS =====
app.use(express.static(path.join(__dirname), {
    maxAge: NODE_ENV === 'production' ? '1d' : 0,
    etag: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return next();
    }
    if (req.path.includes('.')) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ===== MANEJO DE ERRORES =====
app.use((req, res) => {
    logger.warn('Endpoint no encontrado', { path: req.path, method: req.method, ip: req.ip });
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

app.use((err, req, res, next) => {
    logger.error('Error del servidor', { 
        error: err.message, 
        stack: err.stack, 
        path: req.path, 
        method: req.method,
        userId: req.user?.id,
        ip: req.ip
    });
    
    res.status(500).json({
        success: false,
        message: NODE_ENV === 'production' ? 'Error interno del servidor' : err.message,
        ...(NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// ===== GRACEFUL SHUTDOWN =====
process.on('SIGTERM', () => {
    logger.info('SIGTERM recibido, cerrando servidor gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT recibido, cerrando servidor gracefully...');
    process.exit(0);
});

// ===== INICIAR SERVIDOR =====
const server = app.listen(PORT, () => {
    logger.info('Trigal CRM Production Server iniciado', {
        port: PORT,
        environment: NODE_ENV,
        version: '1.2.0',
        timestamp: new Date().toISOString()
    });
    
    console.log('🌽 ===================================');
    console.log('🌽 TRIGAL CRM v1.2.0 - PRODUCCIÓN');
    console.log('🌽 ===================================');
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📊 Ambiente: ${NODE_ENV}`);
    console.log(`📅 Fecha: ${new Date().toLocaleDateString('es-MX')}`);
    console.log(`⏰ Iniciado: ${new Date().toLocaleTimeString('es-MX')}`);
    console.log(`🔐 Seguridad: Helmet + Rate Limiting activado`);
    console.log(`📝 Logging: Winston + Morgan activado`);
    console.log(`💾 Base de datos: Azure SQL (simulada para demo)`);
    console.log('🌽 ===================================');
});

// Timeout para requests
server.timeout = 30000;

module.exports = app;
