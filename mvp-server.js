const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Simulación de base de datos en memoria (para MVP)
let database = {
    usuarios: [
        {
            id: 1,
            username: 'admin',
            email: 'admin@trigal.com',
            password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            nombre: 'Administrador',
            apellido: 'Sistema',
            rol: 'admin',
            activo: true,
            telefono: '',
            zona: '',
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            username: 'gerente.ventas',
            email: 'gerente@trigal.com',
            password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            nombre: 'María',
            apellido: 'González',
            rol: 'gerente_ventas',
            activo: true,
            telefono: '+52 55 1234 5678',
            zona: 'Centro',
            created_at: new Date().toISOString()
        },
        {
            id: 3,
            username: 'vendedor1',
            email: 'vendedor1@trigal.com',
            password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            nombre: 'Carlos',
            apellido: 'Ruiz',
            rol: 'vendedor',
            activo: true,
            telefono: '+52 55 2345 6789',
            zona: 'Norte',
            created_at: new Date().toISOString()
        }
    ],
    clientes: [
        {
            id: 1,
            nombre: 'Tortillería La Esperanza',
            contacto: 'Juan Pérez',
            email: 'juan@laesperanza.com',
            telefono: '+52 55 3456 7890',
            direccion: 'Av. Insurgentes 123, Col. Centro',
            ciudad: 'Ciudad de México',
            estado: 'CDMX',
            codigo_postal: '06000',
            latitud: 19.4326,
            longitud: -99.1332,
            vendedor_id: 3,
            activo: true,
            tipo: 'mayorista',
            limite_credito: 50000,
            dias_credito: 30,
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            nombre: 'Molinos del Valle',
            contacto: 'Ana López',
            email: 'ana@molinosdelvalle.com',
            telefono: '+52 55 4567 8901',
            direccion: 'Calle Reforma 456, Col. Industrial',
            ciudad: 'Guadalajara',
            estado: 'Jalisco',
            codigo_postal: '44100',
            latitud: 20.6597,
            longitud: -103.3496,
            vendedor_id: 3,
            activo: true,
            tipo: 'distribuidor',
            limite_credito: 100000,
            dias_credito: 45,
            created_at: new Date().toISOString()
        }
    ],
    productos: [
        {
            id: 1,
            codigo: 'MAIZ001',
            nombre: 'Maíz Cacahuazintle Blanco',
            descripcion: 'Maíz cacahuazintle de primera calidad para pozole',
            categoria: 'Granos',
            unidad: 'kg',
            precio_base: 25.00,
            iva: 16,
            precio_venta: 29.00,
            stock: 1000,
            stock_minimo: 100,
            activo: true,
            imagen: '',
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            codigo: 'MAIZ002',
            nombre: 'Maíz Amarillo Dent',
            descripcion: 'Maíz amarillo para consumo animal y procesamiento',
            categoria: 'Granos',
            unidad: 'kg',
            precio_base: 15.00,
            iva: 16,
            precio_venta: 17.40,
            stock: 2000,
            stock_minimo: 200,
            activo: true,
            imagen: '',
            created_at: new Date().toISOString()
        },
        {
            id: 3,
            codigo: 'HARINA001',
            nombre: 'Harina de Maíz Nixtamalizada',
            descripcion: 'Harina de maíz nixtamalizada para tortillas',
            categoria: 'Harinas',
            unidad: 'kg',
            precio_base: 18.00,
            iva: 16,
            precio_venta: 20.88,
            stock: 500,
            stock_minimo: 50,
            activo: true,
            imagen: '',
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
            estado: 'pendiente',
            subtotal: 580.00,
            iva: 92.80,
            total: 672.80,
            observaciones: 'Entrega urgente',
            items: [
                {
                    producto_id: 1,
                    cantidad: 20,
                    precio_unitario: 29.00,
                    subtotal: 580.00
                }
            ],
            created_at: new Date().toISOString()
        }
    ],
    promociones: [
        {
            id: 1,
            nombre: 'Descuento Maíz Cacahuazintle',
            descripcion: 'Descuento del 10% en compras mayores a 50kg',
            tipo: 'porcentaje',
            valor: 10,
            productos: [1],
            fecha_inicio: new Date().toISOString(),
            fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            activo: true,
            created_at: new Date().toISOString()
        }
    ],
    visitas: [
        {
            id: 1,
            vendedor_id: 3,
            cliente_id: 1,
            fecha: new Date().toISOString(),
            latitud: 19.4326,
            longitud: -99.1332,
            observaciones: 'Cliente interesado en nuevos productos',
            estado: 'completada',
            created_at: new Date().toISOString()
        }
    ]
};

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'trigal_crm_secret_2025';

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token requerido' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Middleware de autorización por roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ 
                success: false, 
                message: 'No tienes permisos para esta acción' 
            });
        }
        next();
    };
};

// ===== RUTAS DE AUTENTICACIÓN =====

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = database.usuarios.find(u => 
            u.username === username && u.activo
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
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
            { expiresIn: '24h' }
        );

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
                    rol: user.rol
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
});

// Verificar token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        data: { user: req.user }
    });
});

// ===== RUTAS DE USUARIOS =====

// Obtener todos los usuarios (solo admin y gerente)
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

// Crear usuario (solo admin)
app.post('/api/usuarios', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { username, email, password, nombre, apellido, rol, telefono, zona } = req.body;

        // Verificar si el usuario ya existe
        const existeUsuario = database.usuarios.find(u => 
            u.username === username || u.email === email
        );

        if (existeUsuario) {
            return res.status(400).json({
                success: false,
                message: 'El usuario o email ya existe'
            });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = {
            id: Math.max(...database.usuarios.map(u => u.id)) + 1,
            username,
            email,
            password: hashedPassword,
            nombre,
            apellido,
            rol,
            telefono: telefono || '',
            zona: zona || '',
            activo: true,
            created_at: new Date().toISOString()
        };

        database.usuarios.push(nuevoUsuario);

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: {
                ...nuevoUsuario,
                password: undefined
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
            error: error.message
        });
    }
});

// ===== RUTAS DE CLIENTES =====

// Obtener clientes (vendedores ven solo los suyos)
app.get('/api/clientes', authenticateToken, (req, res) => {
    let clientes = database.clientes;

    // Si es vendedor, solo ve sus clientes
    if (req.user.rol === 'vendedor') {
        clientes = clientes.filter(c => c.vendedor_id === req.user.id);
    }

    // Agregar información del vendedor
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

// Crear cliente
app.post('/api/clientes', authenticateToken, (req, res) => {
    try {
        const clienteData = req.body;
        
        const nuevoCliente = {
            id: Math.max(...database.clientes.map(c => c.id)) + 1,
            ...clienteData,
            vendedor_id: clienteData.vendedor_id || req.user.id,
            activo: true,
            created_at: new Date().toISOString()
        };

        database.clientes.push(nuevoCliente);

        res.status(201).json({
            success: true,
            message: 'Cliente creado exitosamente',
            data: nuevoCliente
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear cliente',
            error: error.message
        });
    }
});

// ===== RUTAS DE PRODUCTOS =====

// Obtener productos
app.get('/api/productos', authenticateToken, (req, res) => {
    res.json({
        success: true,
        data: database.productos
    });
});

// Crear producto (solo admin y gerente)
app.post('/api/productos', authenticateToken, authorizeRoles('admin', 'gerente_ventas'), (req, res) => {
    try {
        const productoData = req.body;
        
        const nuevoProducto = {
            id: Math.max(...database.productos.map(p => p.id)) + 1,
            ...productoData,
            precio_venta: productoData.precio_base * (1 + productoData.iva / 100),
            activo: true,
            created_at: new Date().toISOString()
        };

        database.productos.push(nuevoProducto);

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: nuevoProducto
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear producto',
            error: error.message
        });
    }
});

// ===== RUTAS DE PEDIDOS =====

// Obtener pedidos
app.get('/api/pedidos', authenticateToken, (req, res) => {
    let pedidos = database.pedidos;

    // Si es vendedor, solo ve sus pedidos
    if (req.user.rol === 'vendedor') {
        pedidos = pedidos.filter(p => p.vendedor_id === req.user.id);
    }

    // Agregar información adicional
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

// Crear pedido
app.post('/api/pedidos', authenticateToken, (req, res) => {
    try {
        const pedidoData = req.body;
        
        // Generar número de pedido
        const numero = `PED-${new Date().getFullYear()}-${String(database.pedidos.length + 1).padStart(3, '0')}`;
        
        const nuevoPedido = {
            id: Math.max(...database.pedidos.map(p => p.id)) + 1,
            numero,
            ...pedidoData,
            vendedor_id: req.user.id,
            fecha: new Date().toISOString(),
            estado: 'pendiente',
            created_at: new Date().toISOString()
        };

        database.pedidos.push(nuevoPedido);

        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente',
            data: nuevoPedido
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear pedido',
            error: error.message
        });
    }
});

// ===== RUTAS DE PROMOCIONES =====

// Obtener promociones activas
app.get('/api/promociones', authenticateToken, (req, res) => {
    const promocionesActivas = database.promociones.filter(p => 
        p.activo && new Date(p.fecha_fin) > new Date()
    );

    res.json({
        success: true,
        data: promocionesActivas
    });
});

// Crear promoción (solo admin y gerente)
app.post('/api/promociones', authenticateToken, authorizeRoles('admin', 'gerente_ventas'), (req, res) => {
    try {
        const promocionData = req.body;
        
        const nuevaPromocion = {
            id: Math.max(...database.promociones.map(p => p.id)) + 1,
            ...promocionData,
            activo: true,
            created_at: new Date().toISOString()
        };

        database.promociones.push(nuevaPromocion);

        res.status(201).json({
            success: true,
            message: 'Promoción creada exitosamente',
            data: nuevaPromocion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear promoción',
            error: error.message
        });
    }
});

// ===== RUTAS DE VISITAS =====

// Registrar visita
app.post('/api/visitas', authenticateToken, (req, res) => {
    try {
        const visitaData = req.body;
        
        const nuevaVisita = {
            id: Math.max(...database.visitas.map(v => v.id)) + 1,
            ...visitaData,
            vendedor_id: req.user.id,
            fecha: new Date().toISOString(),
            created_at: new Date().toISOString()
        };

        database.visitas.push(nuevaVisita);

        res.status(201).json({
            success: true,
            message: 'Visita registrada exitosamente',
            data: nuevaVisita
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al registrar visita',
            error: error.message
        });
    }
});

// ===== RUTAS DE DASHBOARD =====

// Dashboard data
app.get('/api/dashboard', authenticateToken, (req, res) => {
    try {
        const ahora = new Date();
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        
        let pedidos = database.pedidos;
        let clientes = database.clientes;
        
        // Si es vendedor, filtrar por sus datos
        if (req.user.rol === 'vendedor') {
            pedidos = pedidos.filter(p => p.vendedor_id === req.user.id);
            clientes = clientes.filter(c => c.vendedor_id === req.user.id);
        }
        
        // Calcular KPIs
        const ventasMes = pedidos
            .filter(p => new Date(p.fecha) >= inicioMes)
            .reduce((sum, p) => sum + p.total, 0);
            
        const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente').length;
        
        const clientesActivos = clientes.filter(c => c.activo).length;
        
        // Productos más vendidos
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

        res.json({
            success: true,
            data: {
                kpis: {
                    ventasMes,
                    pedidosPendientes,
                    clientesActivos,
                    productosStock: database.productos.filter(p => p.stock > p.stock_minimo).length
                },
                topProductos,
                ventasPorDia: [], // Implementar según necesidad
                clientesPorZona: [] // Implementar según necesidad
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener datos del dashboard',
            error: error.message
        });
    }
});

// ===== RUTAS ESTÁTICAS =====

// Servir el HTML principal del MVP
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Redirigir cualquier ruta no API al MVP
app.get('*', (req, res, next) => {
    // Si es una ruta de API, continuar al siguiente middleware
    if (req.path.startsWith('/api/')) {
        return next();
    }
    // Si es un archivo estático, continuar
    if (req.path.includes('.')) {
        return next();
    }
    // Para cualquier otra ruta, servir el MVP
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Trigal CRM MVP funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '1.0.0-mvp'
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

// Manejo de errores del servidor
app.use((err, req, res, next) => {
    console.error('Error del servidor:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🌽 Trigal CRM MVP ejecutándose en puerto ${PORT}`);
    console.log(`📊 Modo: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🚀 URL: http://localhost:${PORT}`);
    console.log(`📅 Fecha: ${new Date().toLocaleDateString('es-MX')}`);
    
    // Usuarios de prueba
    console.log('\n👥 Usuarios de prueba:');
    console.log('Admin: admin / password');
    console.log('Gerente: gerente.ventas / password');
    console.log('Vendedor: vendedor1 / password');
});

module.exports = app;
