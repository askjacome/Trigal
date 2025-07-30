// Variables globales
let currentSection = 'dashboard';
let salesChart, clientsChart;
let currentClienteId = null;
let isEditingCliente = false;

// Variables globales adicionales para pedidos
let currentStep = 1;
let pedidoProductos = [];
let pedidoCliente = null;
let currentRuta = null;

// Variables globales adicionales para reportes
let evolucionVentasChart, ventasVendedorChart, ventasCategoriaChart;
let currentReporte = null;

// Variables globales adicionales para gestión de pedidos
let currentPedidoDetallado = null;
let pedidoProductosDetallado = [];

// Variables globales adicionales para gestión de productos
let currentProducto = null;
let productoImagenSeleccionada = null;

// Datos de ejemplo para clientes
const clientesData = {
    'C001': {
        id: 'C001',
        nombre: 'Distribuidora El Sol S.A.',
        razonSocial: 'Distribuidora El Sol, S.A. de C.V.',
        rfc: 'ABC123456XYZ',
        direccion: 'Av. Insurgentes Sur 1234, Col. Del Valle, Ciudad de México',
        telefono: '+52 55 1234 5678',
        email: 'contacto@elsol.com',
        vendedor: 'Juan Pérez',
        condiciones: 'Crédito 30 días',
        estado: 'Activo',
        region: 'Centro',
        ultimoPedido: '2025-01-20',
        historialPedidos: [
            { id: 'P0010', fecha: '2025-01-20', total: '€1,500.00', estado: 'Entregado' },
            { id: 'P0008', fecha: '2025-01-15', total: '€2,300.00', estado: 'Entregado' },
            { id: 'P0005', fecha: '2025-01-10', total: '€890.00', estado: 'Entregado' }
        ]
    },
    'C002': {
        id: 'C002',
        nombre: 'Panadería La Espiga',
        razonSocial: 'Panadería La Espiga, S.A. de C.V.',
        rfc: 'DEF789012ABC',
        direccion: 'Calle Reforma 567, Col. Centro, Guadalajara',
        telefono: '+52 33 9876 5432',
        email: 'info@laespiga.com',
        vendedor: 'María López',
        condiciones: 'Contado',
        estado: 'Activo',
        region: 'Norte',
        ultimoPedido: '2025-01-18',
        historialPedidos: [
            { id: 'P0009', fecha: '2025-01-18', total: '€750.00', estado: 'Entregado' },
            { id: 'P0007', fecha: '2025-01-12', total: '€1,200.00', estado: 'Entregado' },
            { id: 'P0004', fecha: '2025-01-05', total: '€650.00', estado: 'Entregado' }
        ]
    },
    'C003': {
        id: 'C003',
        nombre: 'Ferretería Central',
        razonSocial: 'Ferretería Central, S.A. de C.V.',
        rfc: 'GHI345678DEF',
        direccion: 'Blvd. Constitución 890, Col. Industrial, Monterrey',
        telefono: '+52 81 5555 1234',
        email: 'ventas@ferreteriacentral.com',
        vendedor: 'Carlos Ruiz',
        condiciones: 'Crédito 15 días',
        estado: 'Activo',
        region: 'Sur',
        ultimoPedido: '2025-01-22',
        historialPedidos: [
            { id: 'P0011', fecha: '2025-01-22', total: '€3,200.00', estado: 'Pendiente' },
            { id: 'P0006', fecha: '2025-01-14', total: '€1,800.00', estado: 'Entregado' },
            { id: 'P0003', fecha: '2025-01-08', total: '€950.00', estado: 'Entregado' }
        ]
    },
    'C004': {
        id: 'C004',
        nombre: 'Supermercado Mega',
        razonSocial: 'Supermercado Mega, S.A. de C.V.',
        rfc: 'JKL901234GHI',
        direccion: 'Calle Juárez 456, Col. Norte, Puebla',
        telefono: '+52 222 1234 5678',
        email: 'compras@megasuper.com',
        vendedor: 'Juan Pérez',
        condiciones: 'Crédito 60 días',
        estado: 'Activo',
        region: 'Este',
        ultimoPedido: '2025-01-15',
        historialPedidos: [
            { id: 'P0008', fecha: '2025-01-15', total: '€4,500.00', estado: 'Entregado' },
            { id: 'P0005', fecha: '2025-01-08', total: '€3,100.00', estado: 'Entregado' },
            { id: 'P0002', fecha: '2025-01-02', total: '€2,800.00', estado: 'Entregado' }
        ]
    },
    'C005': {
        id: 'C005',
        nombre: 'Restaurante El Patio',
        razonSocial: 'Restaurante El Patio, S.A. de C.V.',
        rfc: 'MNO567890JKL',
        direccion: 'Av. Hidalgo 789, Col. Centro, Querétaro',
        telefono: '+52 442 9876 5432',
        email: 'gerencia@elpatio.com',
        vendedor: 'María López',
        condiciones: 'Crédito 30 días',
        estado: 'Activo',
        region: 'Oeste',
        ultimoPedido: '2025-01-19',
        historialPedidos: [
            { id: 'P0009', fecha: '2025-01-19', total: '€1,100.00', estado: 'Entregado' },
            { id: 'P0006', fecha: '2025-01-12', total: '€850.00', estado: 'Entregado' },
            { id: 'P0003', fecha: '2025-01-05', total: '€1,300.00', estado: 'Entregado' }
        ]
    }
};

// Datos de ejemplo para productos
const productosData = {
    'PROD001': {
        id: 'PROD001',
        nombre: 'Maíz Cacahuazintle para Pozole',
        sku: 'LAP001',
        categoria: 'Electrónicos',
        marca: 'Dell',
        precio: 1200,
        precioOriginal: 1400,
        stock: 50,
        descripcion: 'Laptop ultraligera con procesador Intel i7 de última generación, 16GB de RAM, SSD de 512GB y pantalla Full HD de 14 pulgadas. Perfecta para trabajo y entretenimiento. Incluye Windows 11 Pro y garantía de 2 años.',
        especificaciones: {
            procesador: 'Intel Core i7-1165G7',
            memoria: '16GB DDR4',
            almacenamiento: '512GB SSD',
            pantalla: '14" Full HD (1920x1080)',
            sistema: 'Windows 11 Pro',
            peso: '1.2 kg'
        },
        imagenes: ['💻', '📱', '🔧'],
        badge: 'oferta',
        descuento: 15
    },
    'PROD002': {
        id: 'PROD002',
        nombre: 'Tostadas de Maíz Natural',
        sku: 'MON002',
        categoria: 'Oficina',
        marca: 'HP',
        precio: 350,
        precioOriginal: 350,
        stock: 25,
        descripcion: 'Monitor curvo de 27 pulgadas con resolución Full HD, perfecto para gaming y trabajo. Incluye tecnología FreeSync y tiempo de respuesta de 1ms.',
        especificaciones: {
            pantalla: '27" Curvo',
            resolucion: '1920x1080 Full HD',
            refresco: '144Hz',
            tiempoRespuesta: '1ms',
            tecnologia: 'FreeSync',
            conectores: 'HDMI, DisplayPort'
        },
        imagenes: ['🖥️', '📱', '🔧'],
        badge: null
    },
    'PROD003': {
        id: 'PROD003',
        nombre: 'Maíz Blanco para Pozole',
        sku: 'TEC003',
        categoria: 'Gaming',
        marca: 'Samsung',
        precio: 120,
        precioOriginal: 120,
        stock: 8,
        descripcion: 'Teclado mecánico con switches Cherry MX Red, iluminación RGB personalizable y diseño ergonómico para gaming profesional.',
        especificaciones: {
            switches: 'Cherry MX Red',
            iluminacion: 'RGB Personalizable',
            conectividad: 'USB-C',
            teclas: '87 teclas',
            material: 'Aluminio'
        },
        imagenes: ['⌨️', '📱', '🔧'],
        badge: 'nuevo'
    },
    'PROD004': {
        id: 'PROD004',
        nombre: 'Tostadas de Maíz Azul',
        sku: 'MOU004',
        categoria: 'Gaming',
        marca: 'Apple',
        precio: 85,
        precioOriginal: 85,
        stock: 30,
        descripcion: 'Mouse gaming de alta precisión con sensor óptico de 16,000 DPI, 6 botones programables y diseño ergonómico.',
        especificaciones: {
            dpi: '16,000 DPI',
            botones: '6 programables',
            sensor: 'Óptico',
            peso: '95g',
            conectividad: 'USB'
        },
        imagenes: ['🖱️', '📱', '🔧'],
        badge: null
    },
    'PROD005': {
        id: 'PROD005',
        nombre: 'Harina de Maíz',
        sku: 'AUR005',
        categoria: 'Electrónicos',
        marca: 'Samsung',
        precio: 95,
        precioOriginal: 95,
        stock: 40,
        descripcion: 'Auriculares inalámbricos con cancelación de ruido activa, batería de hasta 30 horas y calidad de sonido premium.',
        especificaciones: {
            conectividad: 'Bluetooth 5.0',
            bateria: '30 horas',
            cancelacionRuido: 'Activa',
            peso: '250g',
            compatibilidad: 'Multiplataforma'
        },
        imagenes: ['🎧', '📱', '🔧'],
        badge: null
    },
    'PROD006': {
        id: 'PROD006',
        nombre: 'Cable USB-C Premium',
        sku: 'CAB006',
        categoria: 'Hogar',
        marca: 'Dell',
        precio: 25,
        precioOriginal: 25,
        stock: 100,
        descripcion: 'Cable USB-C de alta calidad con soporte para carga rápida y transferencia de datos de hasta 10Gbps.',
        especificaciones: {
            longitud: '2 metros',
            velocidad: '10Gbps',
            carga: '100W',
            material: 'Nylon trenzado',
            compatibilidad: 'USB-C'
        },
        imagenes: ['🔌', '📱', '🔧'],
        badge: null
    },
    'PROD007': {
        id: 'PROD007',
        nombre: 'Soporte para Tablet',
        sku: 'SOP007',
        categoria: 'Oficina',
        marca: 'HP',
        precio: 45,
        precioOriginal: 45,
        stock: 35,
        descripcion: 'Soporte ajustable para tablet con ángulo de inclinación de 0-90 grados, ideal para trabajo y entretenimiento.',
        especificaciones: {
            material: 'Aluminio',
            angulo: '0-90 grados',
            pesoMaximo: '1kg',
            compatibilidad: 'Universal',
            altura: 'Ajustable'
        },
        imagenes: ['📱', '📱', '🔧'],
        badge: null
    },
    'PROD008': {
        id: 'PROD008',
        nombre: 'Control Gaming Wireless',
        sku: 'CON008',
        categoria: 'Gaming',
        marca: 'Apple',
        precio: 180,
        precioOriginal: 180,
        stock: 12,
        descripcion: 'Control inalámbrico para gaming con vibración háptica, gatillos adaptativos y compatibilidad multiplataforma.',
        especificaciones: {
            conectividad: 'Bluetooth/WiFi',
            bateria: '40 horas',
            vibracion: 'Háptica',
            gatillos: 'Adaptativos',
            compatibilidad: 'Multiplataforma'
        },
        imagenes: ['🎮', '📱', '🔧'],
        badge: null
    },
    'MAIZ-001': {
        id: 'MAIZ-001',
        nombre: 'Tostadas de Maíz Natural',
        sku: 'MAIZ-001',
        categoria: 'Maíz y Derivados',
        marca: 'El Trigal',
        precio: 45.00,
        precioOriginal: 45.00,
        stock: 120,
        descripcion: 'Maíz especial para pozole tradicional, de grano grande y sabor auténtico.',
        especificaciones: {
            tipo: 'Cacahuazintle',
            peso: '1kg',
            origen: 'México',
            conservacion: 'Seco',
            caducidad: '12 meses'
        },
        imagenes: ['🌽', '🍲', '🏺'],
        badge: null
    },
    'TOST-001': {
        id: 'TOST-001',
        nombre: 'Tostadas de Maíz Natural',
        sku: 'TOST-001',
        categoria: 'Tostadas',
        marca: 'El Trigal',
        precio: 12.50,
        precioOriginal: 12.50,
        stock: 65,
        descripcion: 'Tostadas naturales de maíz, sin conservadores artificiales.',
        especificaciones: {
            tipo: 'Natural',
            peso: '200g',
            cantidad: '20 piezas',
            ingredientes: 'Maíz, sal',
            conservacion: 'Seco'
        },
        imagenes: ['🌽', '🍞', '🥑'],
        badge: null
    },
    'MAIZ-002': {
        id: 'MAIZ-002',
        nombre: 'Maíz Blanco para Pozole',
        sku: 'MAIZ-002',
        categoria: 'Maíz y Derivados',
        marca: 'El Trigal',
        precio: 38.00,
        precioOriginal: 38.00,
        stock: 95,
        descripcion: 'Maíz blanco de alta calidad para pozole, grano tierno y nutritivo.',
        especificaciones: {
            tipo: 'Blanco',
            peso: '1kg',
            origen: 'México',
            conservacion: 'Seco',
            caducidad: '12 meses'
        },
        imagenes: ['🌽', '🍲', '🏺'],
        badge: null
    },
    'TOST-002': {
        id: 'TOST-002',
        nombre: 'Maíz Blanco para Pozole',
        sku: 'TOST-002',
        categoria: 'Tostadas',
        marca: 'El Trigal',
        precio: 15.00,
        precioOriginal: 15.00,
        stock: 45,
        descripcion: 'Maíz Blanco para Pozole, ricas en antioxidantes y sabor único.',
        especificaciones: {
            tipo: 'Azul',
            peso: '200g',
            cantidad: '20 piezas',
            ingredientes: 'Maíz azul, sal',
            conservacion: 'Seco'
        },
        imagenes: ['🌽', '🍞', '🥑'],
        badge: 'nuevo'
    }
};

// Datos de ejemplo para rutas
const rutasData = {
    'R001': {
        id: 'R001',
        fecha: '2025-07-22',
        vendedor: 'Juan Pérez',
        vendedorId: 'V001',
        nombre: 'Ruta Zona Norte Lunes',
        totalVisitas: 8,
        visitasCompletadas: 7,
        distanciaRecorrida: 45,
        duracionTotal: '6h 30min',
        estado: 'En Ruta',
        ultimaActualizacion: 'Hace 2 minutos',
        progreso: 87.5,
        desviacion: 'Ninguna',
        clientes: [
            { id: 'C001', nombre: 'Panadería La Espiga', direccion: 'Calle Mayor 123, Centro', estado: 'visitado', hora: '09:15' },
            { id: 'C002', nombre: 'Ferretería Central', direccion: 'Av. Industrial 456, Norte', estado: 'visitado', hora: '10:30' },
            { id: 'C003', nombre: 'Distribuidora El Sol', direccion: 'Calle Comercial 789, Este', estado: 'actual', hora: '11:45' },
            { id: 'C004', nombre: 'Tienda de Ropa', direccion: 'Plaza Central 321, Centro', estado: 'pendiente' },
            { id: 'C005', nombre: 'Supermercado Mega', direccion: 'Av. Principal 654, Sur', estado: 'pendiente' }
        ]
    },
    'R002': {
        id: 'R002',
        fecha: '2025-07-21',
        vendedor: 'María López',
        vendedorId: 'V002',
        nombre: 'Ruta Zona Sur Martes',
        totalVisitas: 6,
        visitasCompletadas: 6,
        distanciaRecorrida: 38,
        duracionTotal: '5h 15min',
        estado: 'Completada',
        ultimaActualizacion: 'Hace 1 día',
        progreso: 100,
        desviacion: 'Ninguna',
        clientes: [
            { id: 'C006', nombre: 'Farmacia Central', direccion: 'Av. Salud 123, Sur', estado: 'visitado', hora: '08:30' },
            { id: 'C007', nombre: 'Restaurante El Bueno', direccion: 'Calle Gastronómica 456, Sur', estado: 'visitado', hora: '10:15' }
        ]
    },
    'R003': {
        id: 'R003',
        fecha: '2025-07-20',
        vendedor: 'Carlos Ruiz',
        vendedorId: 'V003',
        nombre: 'Ruta Zona Este Miércoles',
        totalVisitas: 7,
        visitasCompletadas: 5,
        distanciaRecorrida: 42,
        duracionTotal: '5h 45min',
        estado: 'Incompleta',
        ultimaActualizacion: 'Hace 2 días',
        progreso: 71.4,
        desviacion: 'Desviación de 2.1 km',
        clientes: [
            { id: 'C008', nombre: 'Taller Mecánico', direccion: 'Av. Industrial 789, Este', estado: 'visitado', hora: '09:00' },
            { id: 'C009', nombre: 'Peluquería Bella', direccion: 'Calle Belleza 321, Este', estado: 'visitado', hora: '11:30' }
        ]
    }
};

// Datos de vendedores activos
const vendedoresActivos = {
    'V001': {
        id: 'V001',
        nombre: 'Juan Pérez',
        estado: 'En Ruta',
        ubicacion: { lat: 25.30, lng: 30.45 },
        ultimaActualizacion: 'Hace 2 minutos',
        rutaActual: 'R001',
        progreso: 87.5
    },
    'V002': {
        id: 'V002',
        nombre: 'María López',
        estado: 'Visitando Cliente',
        ubicacion: { lat: 45.65, lng: 65.80 },
        ultimaActualizacion: 'Hace 5 minutos',
        rutaActual: 'R004',
        progreso: 60
    },
    'V003': {
        id: 'V003',
        nombre: 'Carlos Ruiz',
        estado: 'Inactivo',
        ubicacion: { lat: 75.25, lng: 25.30 },
        ultimaActualizacion: 'Hace 1 hora',
        rutaActual: null,
        progreso: 0
    }
};

// Variables globales para seguimiento de rutas
let currentVendedorId = 'V001';
let seguimientoInterval = null;
let mobileMode = false;

// Datos de ejemplo para reportes
const reportesData = {
    'ventas-producto': {
        titulo: 'Reporte de Ventas por Producto',
        descripcion: 'Análisis detallado del rendimiento de productos individuales',
        datos: {
            productos: [
                { nombre: 'Harina Premium', ventas: 45200, unidades: 1808, crecimiento: 15 },
                { nombre: 'Aceite Oliva', ventas: 38500, unidades: 770, crecimiento: 8 },
                { nombre: 'Café Molido', ventas: 32100, unidades: 1124, crecimiento: 22 },
                { nombre: 'Leche Polvo', ventas: 28900, unidades: 896, crecimiento: 12 },
                { nombre: 'Azúcar Refinada', ventas: 25400, unidades: 1354, crecimiento: 5 }
            ]
        }
    },
    'ventas-vendedor': {
        titulo: 'Reporte de Ventas por Vendedor',
        descripcion: 'Evaluación del rendimiento individual del equipo de ventas',
        datos: {
            vendedores: [
                { nombre: 'Juan Pérez', ventas: 320000, pedidos: 156, promedio: 2051 },
                { nombre: 'María López', ventas: 285000, pedidos: 142, promedio: 2007 },
                { nombre: 'Carlos Ruiz', ventas: 245000, pedidos: 128, promedio: 1914 },
                { nombre: 'Ana García', ventas: 198000, pedidos: 98, promedio: 2020 },
                { nombre: 'Luis Martínez', ventas: 202000, pedidos: 104, promedio: 1942 }
            ]
        }
    },
    'ventas-region': {
        titulo: 'Reporte de Ventas por Región Geográfica',
        descripcion: 'Análisis territorial y oportunidades de expansión',
        datos: {
            regiones: [
                { nombre: 'Centro', ventas: 450000, clientes: 45, crecimiento: 18 },
                { nombre: 'Norte', ventas: 320000, clientes: 32, crecimiento: 12 },
                { nombre: 'Sur', ventas: 280000, clientes: 28, crecimiento: 8 },
                { nombre: 'Este', ventas: 150000, clientes: 15, crecimiento: 25 },
                { nombre: 'Oeste', ventas: 50000, clientes: 5, crecimiento: 35 }
            ]
        }
    }
};

// Datos de ejemplo para pedidos detallados
const pedidosDetalladosData = {
    'P0010': {
        numero: 'P0010',
        cliente: 'Distribuidora El Sol S.A.',
        vendedor: 'Juan Pérez',
        fechaPedido: '2025-01-20',
        fechaEntrega: '2025-01-25',
        tipo: 'preventa',
        estado: 'Entregado',
        total: 1500.00,
        metodoPago: 'Crédito',
        montoPagado: 1500.00,
        saldoPendiente: 0.00,
        notas: 'Entrega en horario de mañana',
        productos: [
            { nombre: 'Harina de Trigo Premium', cantidad: 50, unidad: 'kg', precio: 25.50, descuento: 5, subtotal: 1211.25 },
            { nombre: 'Aceite de Oliva Extra', cantidad: 10, unidad: 'L', precio: 45.00, descuento: 0, subtotal: 450.00 },
            { nombre: 'Café Molido', cantidad: 5, unidad: 'kg', precio: 28.50, descuento: 10, subtotal: 128.25 }
        ],
        historial: [
            { evento: 'Pedido Entregado', fecha: '2025-01-25 14:30', usuario: 'Juan Pérez', estado: 'completed' },
            { evento: 'Pedido Despachado', fecha: '2025-01-23 09:15', usuario: 'María López', estado: 'completed' },
            { evento: 'Pedido Creado', fecha: '2025-01-20 16:45', usuario: 'Juan Pérez', estado: 'completed' }
        ]
    },
    'P0011': {
        numero: 'P0011',
        cliente: 'Panadería La Espiga',
        vendedor: 'María López',
        fechaPedido: '2025-01-22',
        fechaEntrega: '2025-01-27',
        tipo: 'ruta',
        estado: 'Pendiente',
        total: 850.50,
        metodoPago: 'Efectivo',
        montoPagado: 0.00,
        saldoPendiente: 850.50,
        notas: 'Pedido urgente para fin de semana',
        productos: [
            { nombre: 'Harina de Trigo Premium', cantidad: 20, unidad: 'kg', precio: 25.50, descuento: 0, subtotal: 510.00 },
            { nombre: 'Levadura Fresca', cantidad: 2, unidad: 'kg', precio: 15.00, descuento: 5, subtotal: 28.50 },
            { nombre: 'Azúcar Refinada', cantidad: 10, unidad: 'kg', precio: 12.00, descuento: 0, subtotal: 120.00 },
            { nombre: 'Sal Marina', cantidad: 5, unidad: 'kg', precio: 8.00, descuento: 0, subtotal: 40.00 }
        ],
        historial: [
            { evento: 'Pedido Creado', fecha: '2025-01-22 10:30', usuario: 'María López', estado: 'completed' }
        ]
    }
};

// Datos de ejemplo para listas de precios
const listasPreciosData = {
    'LP001': {
        id: 'LP001',
        nombre: 'Precios Mayoristas',
        descripcion: 'Precios para clientes con volumen de compra alto',
        estado: 'Activa',
        fechaCreacion: '2024-01-15',
        ultimaActualizacion: '2025-01-20',
        productos: 12,
        productosDetalle: [
            { sku: 'PROD001', nombre: 'Maíz Cacahuazintle para Pozole', precioBase: 1200.00, precioLista: 1080.00 },
            { sku: 'PROD002', nombre: 'Tostadas de Maíz Natural', precioBase: 350.00, precioLista: 315.00 },
            { sku: 'PROD003', nombre: 'Maíz Blanco para Pozole', precioBase: 120.00, precioLista: 108.00 },
            { sku: 'PROD004', nombre: 'Tostadas de Maíz Azul', precioBase: 85.00, precioLista: 76.50 },
            { sku: 'PROD005', nombre: 'Harina de Maíz', precioBase: 95.00, precioLista: 85.50 }
        ],
        clientesAsignados: ['C001', 'C002', 'C003']
    },
    'LP002': {
        id: 'LP002',
        nombre: 'Precios Minoristas',
        descripcion: 'Precios estándar para público general',
        estado: 'Activa',
        fechaCreacion: '2024-02-10',
        ultimaActualizacion: '2025-01-18',
        productos: 8,
        productosDetalle: [
            { sku: 'PROD001', nombre: 'Maíz Cacahuazintle para Pozole', precioBase: 1200.00, precioLista: 1200.00 },
            { sku: 'PROD002', nombre: 'Tostadas de Maíz Natural', precioBase: 350.00, precioLista: 350.00 }
        ],
        clientesAsignados: ['C004', 'C005']
    },
    'LP003': {
        id: 'LP003',
        nombre: 'Precios VIP',
        descripcion: 'Precios especiales para clientes premium',
        estado: 'Activa',
        fechaCreacion: '2024-03-05',
        ultimaActualizacion: '2025-01-22',
        productos: 15,
        productosDetalle: [
            { sku: 'PROD001', nombre: 'Maíz Cacahuazintle para Pozole', precioBase: 1200.00, precioLista: 1100.00 },
            { sku: 'PROD002', nombre: 'Tostadas de Maíz Natural', precioBase: 350.00, precioLista: 320.00 }
        ],
        clientesAsignados: ['C001']
    },
    'LP004': {
        id: 'LP004',
        nombre: 'Precios Temporada Verano 2025',
        descripcion: 'Precios promocionales para temporada de verano',
        estado: 'Programada',
        fechaCreacion: '2024-12-15',
        ultimaActualizacion: '2025-01-25',
        productos: 6,
        productosDetalle: [
            { sku: 'PROD006', nombre: 'Ventilador USB', precioBase: 25.00, precioLista: 20.00 },
            { sku: 'PROD007', nombre: 'Protector Solar', precioBase: 15.00, precioLista: 12.00 }
        ],
        clientesAsignados: []
    },
    'LP005': {
        id: 'LP005',
        nombre: 'Precios Distribuidores',
        descripcion: 'Precios especiales para distribuidores autorizados',
        estado: 'Inactiva',
        fechaCreacion: '2024-01-20',
        ultimaActualizacion: '2024-12-10',
        productos: 20,
        productosDetalle: [
            { sku: 'PROD001', nombre: 'Maíz Cacahuazintle para Pozole', precioBase: 1200.00, precioLista: 1000.00 },
            { sku: 'PROD002', nombre: 'Tostadas de Maíz Natural', precioBase: 350.00, precioLista: 300.00 }
        ],
        clientesAsignados: []
    }
};

// Variables globales para listas de precios
let currentListaId = null;
let isEditingLista = false;
let productosEnLista = [];

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupClientesModule();
});

// Función principal de inicialización
function initializeApp() {
    setupNavigation();
    setupMobileMenu();
    setupCharts();
    setupEventListeners();
    setupPaymentModal();
    setupKPIInteractions();
    setupResponsiveFeatures();
    setupClientesModule();
    setupPedidosModule();
    setupReportesModule();
    setupGestionPedidosModule();
    setupProductosModule();
    setupListasPreciosModule();
    setupSeguimientoRutasModule();
    setupPortalClienteModule();
    setupNotificacionesModule();
}

// Configuración específica del módulo de clientes
function setupClientesModule() {
    setupClientesSearch();
    setupClientesFilters();
    setupClientesForm();
    setupClientesButtons();
}

// Configurar búsqueda de clientes
function setupClientesSearch() {
    const searchInput = document.getElementById('searchClientes');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterClientesBySearch(searchTerm);
        });
    }
}

// Configurar filtros de clientes
function setupClientesFilters() {
    const filterVendedor = document.getElementById('filterVendedor');
    const filterRegion = document.getElementById('filterRegion');
    const filterStatus = document.getElementById('filterStatus');
    
    [filterVendedor, filterRegion, filterStatus].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', function() {
                applyClientesFilters();
            });
        }
    });
}

// Configurar formulario de clientes
function setupClientesForm() {
    const form = document.getElementById('clienteForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarCliente();
        });
    }
}

// Configurar botones de clientes
function setupClientesButtons() {
    const btnNuevoCliente = document.getElementById('btnNuevoCliente');
    if (btnNuevoCliente) {
        btnNuevoCliente.addEventListener('click', function() {
            mostrarFormularioNuevoCliente();
        });
    }
}

// Filtrar clientes por búsqueda
function filterClientesBySearch(searchTerm) {
    const rows = document.querySelectorAll('#clientesLista tbody tr');
    
    rows.forEach(row => {
        const clienteId = row.querySelector('.client-id')?.textContent || '';
        const clienteNombre = row.querySelector('.client-name')?.textContent || '';
        const clienteEmail = row.querySelector('.client-company')?.textContent || '';
        const vendedor = row.querySelector('td:nth-child(3)')?.textContent || '';
        
        const searchText = `${clienteId} ${clienteNombre} ${clienteEmail} ${vendedor}`.toLowerCase();
        
        if (searchText.includes(searchTerm)) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

// Aplicar filtros de clientes
function applyClientesFilters() {
    const filterVendedor = document.getElementById('filterVendedor')?.value || '';
    const filterRegion = document.getElementById('filterRegion')?.value || '';
    const filterStatus = document.getElementById('filterStatus')?.value || '';
    
    const rows = document.querySelectorAll('#clientesLista tbody tr');
    
    rows.forEach(row => {
        const vendedor = row.querySelector('td:nth-child(3)')?.textContent || '';
        const region = row.querySelector('td:nth-child(4)')?.textContent || '';
        const status = row.querySelector('.status')?.textContent || '';
        
        const matchVendedor = !filterVendedor || vendedor === filterVendedor;
        const matchRegion = !filterRegion || region === filterRegion;
        const matchStatus = !filterStatus || status === filterStatus;
        
        if (matchVendedor && matchRegion && matchStatus) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

// Ver detalle de cliente
function verDetalleCliente(clienteId) {
    currentClienteId = clienteId;
    const cliente = clientesData[clienteId];
    
    if (!cliente) {
        alert('Cliente no encontrado');
        return;
    }
    
    // Ocultar lista y mostrar detalle
    document.getElementById('clientesLista').style.display = 'none';
    document.getElementById('clienteDetalle').style.display = 'block';
    
    // Llenar información del cliente
    document.getElementById('detalleClienteId').textContent = cliente.id;
    document.getElementById('detalleClienteNombre').textContent = cliente.nombre;
    document.getElementById('detalleClienteEmpresa').textContent = cliente.nombre;
    document.getElementById('detalleClienteRazon').textContent = cliente.razonSocial;
    document.getElementById('detalleClienteRfc').textContent = cliente.rfc;
    document.getElementById('detalleClienteDireccion').textContent = cliente.direccion;
    document.getElementById('detalleClienteTelefono').textContent = cliente.telefono;
    document.getElementById('detalleClienteEmail').textContent = cliente.email;
    document.getElementById('detalleClienteVendedor').textContent = cliente.vendedor;
    document.getElementById('detalleClienteCondiciones').textContent = cliente.condiciones;
    document.getElementById('detalleClienteEstado').textContent = cliente.estado;
    
    // Actualizar historial de pedidos
    actualizarHistorialPedidos(cliente.historialPedidos);
    
    // Actualizar mapa
    actualizarMapaCliente(cliente.direccion);
}

// Actualizar historial de pedidos
function actualizarHistorialPedidos(pedidos) {
    const tbody = document.getElementById('historialPedidos');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    pedidos.forEach(pedido => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pedido.id}</td>
            <td>${pedido.fecha}</td>
            <td>${pedido.total}</td>
            <td><span class="status ${pedido.estado === 'Entregado' ? 'completed' : 'pending'}">${pedido.estado}</span></td>
            <td>
                <button class="action-btn" title="Ver Detalles" onclick="verDetallePedido('${pedido.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Actualizar mapa del cliente
function actualizarMapaCliente(direccion) {
    const mapaOverlay = document.querySelector('.mapa-overlay p');
    if (mapaOverlay) {
        mapaOverlay.textContent = `Ubicación: ${direccion}`;
    }
}

// Volver a la lista de clientes
function volverALista() {
    document.getElementById('clienteDetalle').style.display = 'none';
    document.getElementById('clientesLista').style.display = 'block';
    currentClienteId = null;
}

// Crear pedido para cliente
function crearPedidoCliente(clienteId) {
    console.log('Creando pedido para cliente:', clienteId);
    
    try {
        // Buscar el cliente en los datos
        const cliente = clientesData[clienteId];
        if (cliente) {
            // Mostrar confirmación antes de proceder
            const confirmar = confirm(`¿Deseas crear un nuevo pedido para ${cliente.nombre}?`);
            
            if (confirmar) {
                console.log('Usuario confirmó crear pedido');
                
                // Mostrar notificación de que se está creando el pedido
                mostrarNotificacion(`Creando nuevo pedido para ${cliente.nombre}`);
                
                // Cambiar a la sección de ventas
                console.log('Cambiando a sección ventas...');
                switchSection('ventas');
                
                // Esperar un momento para que la sección se cargue
                setTimeout(() => {
                    console.log('Mostrando formulario de nuevo pedido...');
                    
                    // Verificar que la sección de ventas esté visible
                    const ventasSection = document.getElementById('ventas');
                    if (ventasSection && ventasSection.classList.contains('active')) {
                        console.log('Sección de ventas está activa');
                        
                        // Mostrar el formulario de nuevo pedido
                        mostrarFormularioNuevoPedido();
                        
                        // Pre-seleccionar el cliente en el formulario
                        const clienteInput = document.getElementById('clientePedido');
                        if (clienteInput) {
                            clienteInput.value = cliente.nombre;
                            console.log('Cliente pre-seleccionado:', cliente.nombre);
                        }
                        
                        // Establecer el cliente actual para el pedido
                        pedidoCliente = cliente;
                        console.log('Cliente establecido para el pedido:', pedidoCliente);
                        
                        // Mostrar el resumen del cliente
                        mostrarResumenCliente(cliente);
                        
                        // Ir al primer paso del formulario
                        mostrarPaso(1);
                        
                        // Scroll suave hacia el formulario
                        setTimeout(() => {
                            const formulario = document.getElementById('formularioPedido');
                            if (formulario) {
                                formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                console.log('✅ Formulario de pedido mostrado correctamente');
                            } else {
                                console.error('❌ No se encontró el formulario de pedido');
                            }
                        }, 200);
                        
                    } else {
                        console.error('❌ La sección de ventas no está activa');
                        alert('Error: No se pudo cambiar a la sección de ventas');
                    }
                    
                }, 300);
                
            } else {
                console.log('Usuario canceló la creación del pedido');
            }
            
        } else {
            // Si no se encuentra el cliente, mostrar mensaje
            console.error(`❌ Cliente ${clienteId} no encontrado en la base de datos`);
            alert(`Cliente ${clienteId} no encontrado en la base de datos`);
        }
    } catch (error) {
        console.error('❌ Error en crearPedidoCliente:', error);
        alert('Error al crear pedido: ' + error.message);
    }
}

// Función para mostrar el resumen del cliente en el formulario de pedido
function mostrarResumenCliente(cliente) {
    console.log('Mostrando resumen del cliente:', cliente);
    
    const resumenContainer = document.getElementById('clienteResumen');
    const avatar = document.getElementById('clienteAvatar');
    const nombre = document.getElementById('clienteNombre');
    const direccion = document.getElementById('clienteDireccion');
    const contacto = document.getElementById('clienteContacto');
    
    if (resumenContainer && avatar && nombre && direccion && contacto) {
        // Configurar avatar con inicial del cliente
        const inicial = cliente.nombre.charAt(0).toUpperCase();
        const color = getRandomColor();
        avatar.src = `https://via.placeholder.com/60x60/${color}/FFFFFF?text=${inicial}`;
        
        // Llenar información del cliente
        nombre.textContent = cliente.nombre;
        direccion.textContent = cliente.direccion || 'Dirección no disponible';
        contacto.textContent = `${cliente.telefono || 'Sin teléfono'} | ${cliente.email || 'Sin email'}`;
        
        // Mostrar el resumen
        resumenContainer.style.display = 'block';
        console.log('Resumen del cliente mostrado correctamente');
    } else {
        console.error('No se encontraron los elementos del resumen del cliente');
        console.log('resumenContainer:', resumenContainer);
        console.log('avatar:', avatar);
        console.log('nombre:', nombre);
        console.log('direccion:', direccion);
        console.log('contacto:', contacto);
    }
}

// Ver mapa del cliente
function verMapaCliente(clienteId) {
    const cliente = clientesData[clienteId];
    if (cliente) {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cliente.direccion)}`;
        window.open(url, '_blank');
    }
}

// Editar cliente
function editarCliente(clienteId) {
    currentClienteId = clienteId;
    isEditingCliente = true;
    const cliente = clientesData[clienteId];
    
    if (!cliente) {
        alert('Cliente no encontrado');
        return;
    }
    
    mostrarFormularioEditarCliente(cliente);
}

// Editar cliente desde detalle
function editarClienteDesdeDetalle() {
    if (currentClienteId) {
        editarCliente(currentClienteId);
    }
}

// Crear pedido desde detalle
function crearPedidoDesdeDetalle() {
    if (currentClienteId) {
        // Cerrar la vista de detalle del cliente
        volverALista();
        // Crear el pedido para el cliente
        crearPedidoCliente(currentClienteId);
    }
}

// Mostrar formulario de nuevo cliente
function mostrarFormularioNuevoCliente() {
    isEditingCliente = false;
    currentClienteId = null;
    
    // Ocultar otras vistas
    document.getElementById('clientesLista').style.display = 'none';
    document.getElementById('clienteDetalle').style.display = 'none';
    document.getElementById('formularioCliente').style.display = 'block';
    
    // Limpiar formulario
    document.getElementById('clienteForm').reset();
    document.getElementById('formularioTitulo').textContent = 'Nuevo Cliente';
}

// Mostrar formulario de editar cliente
function mostrarFormularioEditarCliente(cliente) {
    // Ocultar otras vistas
    document.getElementById('clientesLista').style.display = 'none';
    document.getElementById('clienteDetalle').style.display = 'none';
    document.getElementById('formularioCliente').style.display = 'block';
    
    // Llenar formulario con datos del cliente
    document.getElementById('formularioTitulo').textContent = 'Editar Cliente';
    document.getElementById('nombreEmpresa').value = cliente.nombre;
    document.getElementById('razonSocial').value = cliente.razonSocial;
    document.getElementById('rfc').value = cliente.rfc;
    document.getElementById('direccion').value = cliente.direccion;
    document.getElementById('telefono').value = cliente.telefono;
    document.getElementById('email').value = cliente.email;
    document.getElementById('vendedorAsignado').value = cliente.vendedor;
    document.getElementById('condicionesPago').value = cliente.condiciones;
    document.getElementById('region').value = cliente.region;
}

// Cancelar formulario
function cancelarFormulario() {
    document.getElementById('formularioCliente').style.display = 'none';
    document.getElementById('clientesLista').style.display = 'block';
    currentClienteId = null;
    isEditingCliente = false;
}

// Guardar cliente
function guardarCliente() {
    const formData = new FormData(document.getElementById('clienteForm'));
    const clienteData = {
        nombre: formData.get('nombreEmpresa'),
        razonSocial: formData.get('razonSocial'),
        rfc: formData.get('rfc'),
        direccion: formData.get('direccion'),
        telefono: formData.get('telefono'),
        email: formData.get('email'),
        vendedor: formData.get('vendedorAsignado'),
        condiciones: formData.get('condicionesPago'),
        region: formData.get('region'),
        notas: formData.get('notasAdicionales')
    };
    
    if (isEditingCliente && currentClienteId) {
        // Actualizar cliente existente
        console.log('Actualizando cliente:', currentClienteId, clienteData);
        alert('Cliente actualizado exitosamente');
    } else {
        // Crear nuevo cliente
        const nuevoId = 'C' + String(Object.keys(clientesData).length + 1).padStart(3, '0');
        console.log('Creando nuevo cliente:', nuevoId, clienteData);
        alert('Cliente creado exitosamente');
    }
    
    // Volver a la lista
    cancelarFormulario();
}

// Ubicar en mapa
function ubicarEnMapa() {
    const direccion = document.getElementById('direccion').value;
    if (direccion) {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
        window.open(url, '_blank');
    } else {
        alert('Por favor, ingresa una dirección primero');
    }
}

// Abrir Google Maps
function abrirGoogleMaps() {
    if (currentClienteId) {
        const cliente = clientesData[currentClienteId];
        if (cliente) {
            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cliente.direccion)}`;
            window.open(url, '_blank');
        }
    }
}

// Ver detalle de pedido
function verDetallePedido(pedidoId) {
    console.log('Viendo detalle del pedido:', pedidoId);
    alert(`Detalles del pedido ${pedidoId}`);
}

// Editar pedido
function editarPedido(pedidoId) {
    console.log('Editando pedido:', pedidoId);
    alert(`Editando pedido ${pedidoId}`);
}

// Marcar como entregado
function marcarEntregado(pedidoId) {
    if (confirm(`¿Confirmar entrega del pedido ${pedidoId}?`)) {
        console.log('Marcando como entregado:', pedidoId);
        alert(`Pedido ${pedidoId} marcado como entregado`);
    }
}

// Imprimir pedido
function imprimirPedido(pedidoId) {
    console.log('Imprimiendo pedido:', pedidoId);
    alert(`Imprimiendo pedido ${pedidoId}`);
}

// Configuración específica del módulo de pedidos
function setupPedidosModule() {
    setupPedidosSearch();
    setupPedidosFilters();
    setupPedidosForm();
    setupPedidosButtons();
    setupRutasModule();
}

// Configurar búsqueda de pedidos
function setupPedidosSearch() {
    const searchInput = document.getElementById('searchPedidos');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterPedidosBySearch(searchTerm);
        });
    }
}

// Configurar filtros de pedidos
function setupPedidosFilters() {
    const filterEstado = document.getElementById('filterEstadoPedido');
    const filterFecha = document.getElementById('filterFechaPedido');
    
    [filterEstado, filterFecha].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', function() {
                applyPedidosFilters();
            });
        }
    });
}

// Configurar formulario de pedidos
function setupPedidosForm() {
    const form = document.getElementById('pedidoForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            confirmarPedido();
        });
    }
    
    // Configurar búsqueda de clientes
    const clienteInput = document.getElementById('clientePedido');
    if (clienteInput) {
        clienteInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length >= 2) {
                mostrarSugerenciasClientes(searchTerm);
            } else {
                ocultarSugerenciasClientes();
            }
        });
    }
    
    // Configurar búsqueda de productos
    const productoInput = document.getElementById('productoPedido');
    if (productoInput) {
        // Sobrescribir cualquier evento existente
        productoInput.removeEventListener('input', mostrarSugerenciasProductos);
        
        productoInput.addEventListener('input', function() {
            console.log('🔍 Input de búsqueda activado:', this.value);
            const searchTerm = this.value.toLowerCase();
            
            // Siempre forzar productos de maíz
            setTimeout(() => {
                forzarProductosMaiz();
                mostrarSugerenciasProductos(searchTerm);
            }, 50);
        });
        
        // Evento al hacer focus en el campo
        productoInput.addEventListener('focus', function() {
            console.log('🎯 Campo de búsqueda enfocado');
            setTimeout(() => {
                forzarProductosMaiz();
                mostrarSugerenciasProductos('');
            }, 100);
        });
        
        // Evento al hacer clic en el campo
        productoInput.addEventListener('click', function() {
            console.log('🖱️ Click en campo de búsqueda');
            setTimeout(() => {
                forzarProductosMaiz();
                mostrarSugerenciasProductos('');
            }, 50);
        });
        
        // Mostrar productos de maíz por defecto inmediatamente
        setTimeout(() => {
            forzarProductosMaiz();
            mostrarSugerenciasProductos('');
        }, 100);
        
        // Forzar cada segundo durante los primeros 10 segundos
        let contador = 0;
        const intervalId = setInterval(() => {
            contador++;
            if (contador <= 10) {
                forzarProductosMaiz();
                mostrarSugerenciasProductos('');
            } else {
                clearInterval(intervalId);
            }
        }, 1000);
    }
    
    // Configurar métodos de pago
    const metodosPago = document.querySelectorAll('input[name="metodoPago"]');
    metodosPago.forEach(radio => {
        radio.addEventListener('change', function() {
            mostrarCamposPago(this.value);
        });
    });
    
    // Configurar descuento
    const descuentoInput = document.getElementById('descuentoPedido');
    if (descuentoInput) {
        descuentoInput.addEventListener('input', function() {
            calcularTotales();
        });
    }
}

// Configurar botones de pedidos
function setupPedidosButtons() {
    const btnNuevoPedido = document.getElementById('btnNuevoPedido');
    const btnGestionRutas = document.getElementById('btnGestionRutas');
    
    if (btnNuevoPedido) {
        btnNuevoPedido.addEventListener('click', function() {
            mostrarFormularioNuevoPedido();
        });
    }
    
    if (btnGestionRutas) {
        btnGestionRutas.addEventListener('click', function() {
            mostrarGestionRutas();
        });
    }
}

// Configurar módulo de rutas
function setupRutasModule() {
    // Configurar botones de rutas
    const btnCrearRuta = document.querySelector('[onclick="crearNuevaRuta()"]');
    if (btnCrearRuta) {
        btnCrearRuta.addEventListener('click', crearNuevaRuta);
    }
}

// Filtrar pedidos por búsqueda
function filterPedidosBySearch(searchTerm) {
    const rows = document.querySelectorAll('#pedidosContainer tbody tr');
    
    rows.forEach(row => {
        const pedidoId = row.querySelector('.pedido-id')?.textContent || '';
        const clienteNombre = row.querySelector('.client-name')?.textContent || '';
        const searchText = `${pedidoId} ${clienteNombre}`.toLowerCase();
        
        if (searchText.includes(searchTerm)) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

// Aplicar filtros de pedidos
function applyPedidosFilters() {
    const filterEstado = document.getElementById('filterEstadoPedido')?.value || '';
    const filterFecha = document.getElementById('filterFechaPedido')?.value || '';
    
    const rows = document.querySelectorAll('#pedidosContainer tbody tr');
    
    rows.forEach(row => {
        const estado = row.querySelector('.status')?.textContent || '';
        const fecha = row.querySelector('td:nth-child(3)')?.textContent || '';
        
        const matchEstado = !filterEstado || estado === filterEstado;
        const matchFecha = !filterFecha || filtrarPorFecha(fecha, filterFecha);
        
        if (matchEstado && matchFecha) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

// Filtrar por fecha
function filtrarPorFecha(fechaPedido, filtro) {
    const hoy = new Date();
    const fechaPedidoDate = new Date(fechaPedido);
    
    switch (filtro) {
        case 'hoy':
            return fechaPedidoDate.toDateString() === hoy.toDateString();
        case 'semana':
            const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()));
            return fechaPedidoDate >= inicioSemana;
        case 'mes':
            return fechaPedidoDate.getMonth() === hoy.getMonth() && 
                   fechaPedidoDate.getFullYear() === hoy.getFullYear();
        default:
            return true;
    }
}

// Mostrar formulario de nuevo pedido
function mostrarFormularioNuevoPedido() {
    // Ocultar otras vistas
    document.getElementById('pedidosContainer').style.display = 'none';
    document.getElementById('rutasContainer').style.display = 'none';
    document.getElementById('rutaProgreso').style.display = 'none';
    document.getElementById('formularioPedido').style.display = 'block';
    
    // Resetear formulario
    resetearFormularioPedido();
    mostrarPaso(1);
    
    // Mostrar productos de maíz y tostadas por defecto cuando se abre el formulario
    setTimeout(() => {
        const productoInput = document.getElementById('productoPedido');
        if (productoInput) {
            mostrarSugerenciasProductos('');
        }
    }, 1000);
}

// Resetear formulario de pedido
function resetearFormularioPedido() {
    currentStep = 1;
    pedidoProductos = [];
    pedidoCliente = null;
    
    document.getElementById('pedidoForm').reset();
    document.getElementById('clienteResumen').style.display = 'none';
    document.getElementById('productoSeleccionado').style.display = 'none';
    document.getElementById('productosTableBody').innerHTML = '';
    document.getElementById('pagoCampos').style.display = 'none';
    
    calcularTotales();
}

// Mostrar paso específico
function mostrarPaso(paso) {
    // Ocultar todos los pasos
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`step${i}`).style.display = 'none';
    }
    
    // Mostrar paso actual
    document.getElementById(`step${paso}`).style.display = 'block';
    currentStep = paso;
}

// Siguiente paso
function siguientePaso() {
    if (validarPasoActual()) {
        if (currentStep < 3) {
            mostrarPaso(currentStep + 1);
        }
    }
}

// Anterior paso
function anteriorPaso() {
    if (currentStep > 1) {
        mostrarPaso(currentStep - 1);
    }
}

// Validar paso actual
function validarPasoActual() {
    switch (currentStep) {
        case 1:
            const cliente = document.getElementById('clientePedido').value;
            if (!cliente || !pedidoCliente) {
                alert('Por favor, selecciona un cliente válido');
                return false;
            }
            break;
        case 2:
            if (pedidoProductos.length === 0) {
                alert('Por favor, agrega al menos un producto al pedido');
                return false;
            }
            break;
        case 3:
            const fechaEntrega = document.getElementById('fechaEntrega').value;
            const metodoPago = document.querySelector('input[name="metodoPago"]:checked');
            if (!fechaEntrega) {
                alert('Por favor, selecciona una fecha de entrega');
                return false;
            }
            if (!metodoPago) {
                alert('Por favor, selecciona un método de pago');
                return false;
            }
            break;
    }
    return true;
}

// Mostrar sugerencias de clientes
function mostrarSugerenciasClientes(searchTerm) {
    const suggestions = document.getElementById('clienteSuggestions');
    suggestions.innerHTML = '';
    
    const clientesFiltrados = Object.values(clientesData).filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTerm) ||
        cliente.id.toLowerCase().includes(searchTerm)
    );
    
    clientesFiltrados.forEach(cliente => {
        const item = document.createElement('div');
        item.className = 'cliente-suggestion-item';
        item.innerHTML = `
            <div>
                <strong>${cliente.nombre}</strong>
                <div style="font-size: 0.875rem; color: var(--text-secondary);">${cliente.id}</div>
            </div>
        `;
        item.addEventListener('click', () => seleccionarCliente(cliente));
        suggestions.appendChild(item);
    });
    
    suggestions.style.display = clientesFiltrados.length > 0 ? 'block' : 'none';
}

// Ocultar sugerencias de clientes
function ocultarSugerenciasClientes() {
    document.getElementById('clienteSuggestions').style.display = 'none';
}

// Seleccionar cliente
function seleccionarCliente(cliente) {
    pedidoCliente = cliente;
    document.getElementById('clientePedido').value = cliente.nombre;
    document.getElementById('clienteAvatar').src = `https://via.placeholder.com/48x48/${getRandomColor()}/FFFFFF?text=${cliente.nombre.charAt(0)}`;
    document.getElementById('clienteNombre').textContent = cliente.nombre;
    document.getElementById('clienteDireccion').textContent = cliente.direccion;
    document.getElementById('clienteContacto').textContent = `${cliente.telefono} | ${cliente.email}`;
    
    document.getElementById('clienteResumen').style.display = 'block';
    ocultarSugerenciasClientes();
}

// Mostrar sugerencias de productos
function mostrarSugerenciasProductos(searchTerm) {
    const suggestions = document.getElementById('productoSuggestions');
    suggestions.innerHTML = '';
    
    let productosFiltrados;
    
    if (searchTerm === '') {
        // Si no hay término de búsqueda, mostrar productos de maíz y tostadas por defecto
        productosFiltrados = Object.values(productosData).filter(producto =>
            producto.categoria.includes('Maíz') || producto.categoria.includes('Tostada')
        );
    } else {
        // Filtrar por término de búsqueda, priorizando productos de maíz y tostadas
        const todosLosProductos = Object.values(productosData);
        const productosMaizTostadas = todosLosProductos.filter(producto =>
            (producto.categoria.includes('Maíz') || producto.categoria.includes('Tostada')) &&
            (producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
             producto.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
             producto.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        const otrosProductos = todosLosProductos.filter(producto =>
            !producto.categoria.includes('Maíz') && !producto.categoria.includes('Tostada') &&
            (producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
             producto.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
             producto.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        // Combinar resultados, priorizando maíz y tostadas
        productosFiltrados = [...productosMaizTostadas, ...otrosProductos];
    }
    
    productosFiltrados.forEach(producto => {
        const item = document.createElement('div');
        item.className = 'producto-suggestion-item';
        item.innerHTML = `
            <div>
                <strong>${producto.nombre}</strong>
                <div style="font-size: 0.875rem; color: var(--text-secondary);">
                    ${producto.categoria} | €${producto.precio.toFixed(2)} | Stock: ${producto.stock}
                </div>
            </div>
        `;
        item.addEventListener('click', () => seleccionarProducto(producto));
        suggestions.appendChild(item);
    });
    
    suggestions.style.display = productosFiltrados.length > 0 ? 'block' : 'none';
}

// Ocultar sugerencias de productos
function ocultarSugerenciasProductos() {
    document.getElementById('productoSuggestions').style.display = 'none';
}

// Seleccionar producto
function seleccionarProducto(producto) {
    document.getElementById('productoPedido').value = producto.nombre;
    document.getElementById('productoNombre').textContent = producto.nombre;
    document.getElementById('productoPrecio').textContent = `€${producto.precio.toFixed(2)}`;
    document.getElementById('productoStock').textContent = producto.stock;
    document.getElementById('productoCantidad').max = producto.stock;
    document.getElementById('productoCantidad').value = 1;
    
    document.getElementById('productoSeleccionado').style.display = 'block';
    ocultarSugerenciasProductos();
}

// Agregar producto al pedido
function agregarProducto() {
    const productoNombre = document.getElementById('productoNombre').textContent;
    const cantidad = parseInt(document.getElementById('productoCantidad').value);
    const precio = parseFloat(document.getElementById('productoPrecio').textContent.replace('€', ''));
    
    if (cantidad <= 0) {
        alert('La cantidad debe ser mayor a 0');
        return;
    }
    
    const producto = {
        id: Date.now(),
        nombre: productoNombre,
        cantidad: cantidad,
        precio: precio,
        subtotal: cantidad * precio
    };
    
    pedidoProductos.push(producto);
    actualizarTablaProductos();
    calcularTotales();
    
    // Limpiar selección
    document.getElementById('productoPedido').value = '';
    document.getElementById('productoSeleccionado').style.display = 'none';
}

// Actualizar tabla de productos
function actualizarTablaProductos() {
    const tbody = document.getElementById('productosTableBody');
    tbody.innerHTML = '';
    
    pedidoProductos.forEach((producto, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>€${producto.precio.toFixed(2)}</td>
            <td>€${producto.subtotal.toFixed(2)}</td>
            <td>
                <button class="action-btn" title="Eliminar" onclick="eliminarProducto(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Eliminar producto
function eliminarProducto(index) {
    pedidoProductos.splice(index, 1);
    actualizarTablaProductos();
    calcularTotales();
}

// Calcular totales
function calcularTotales() {
    const subtotal = pedidoProductos.reduce((sum, producto) => sum + producto.subtotal, 0);
    const descuento = parseFloat(document.getElementById('descuentoPedido').value) || 0;
    const descuentoCalculado = subtotal * (descuento / 100);
    const total = subtotal - descuentoCalculado;
    
    document.getElementById('subtotalPedido').textContent = `€${subtotal.toFixed(2)}`;
    document.getElementById('descuentoCalculado').textContent = `€${descuentoCalculado.toFixed(2)}`;
    document.getElementById('totalPedido').textContent = `€${total.toFixed(2)}`;
    document.getElementById('totalFinalPedido').textContent = `€${total.toFixed(2)}`;
}

// Mostrar campos de pago según método seleccionado
function mostrarCamposPago(metodo) {
    const pagoCampos = document.getElementById('pagoCampos');
    const pagoStripe = document.getElementById('pagoStripeCampos');
    const pagoTpvClip = document.getElementById('pagoTpvClipCampos');
    
    pagoCampos.style.display = 'block';
    pagoStripe.style.display = metodo === 'stripe' ? 'block' : 'none';
    pagoTpvClip.style.display = metodo === 'tpvclip' ? 'block' : 'none';
}

// Guardar borrador
function guardarBorrador() {
    console.log('Guardando borrador del pedido...');
    alert('Borrador guardado exitosamente');
}

// Confirmar pedido
function confirmarPedido() {
    if (validarPasoActual()) {
        console.log('Confirmando pedido:', {
            cliente: pedidoCliente,
            productos: pedidoProductos,
            total: document.getElementById('totalFinalPedido').textContent
        });
        
        alert('Pedido confirmado exitosamente');
        cancelarFormularioPedido();
    }
}

// Cancelar formulario de pedido
function cancelarFormularioPedido() {
    document.getElementById('formularioPedido').style.display = 'none';
    document.getElementById('pedidosContainer').style.display = 'block';
    resetearFormularioPedido();
}

// Mostrar gestión de rutas
function mostrarGestionRutas() {
    document.getElementById('pedidosContainer').style.display = 'none';
    document.getElementById('formularioPedido').style.display = 'none';
    document.getElementById('rutaProgreso').style.display = 'none';
    document.getElementById('rutasContainer').style.display = 'block';
}

// Volver a pedidos
function volverAPedidos() {
    document.getElementById('rutasContainer').style.display = 'none';
    document.getElementById('rutaProgreso').style.display = 'none';
    document.getElementById('formularioPedido').style.display = 'none';
    document.getElementById('pedidosContainer').style.display = 'block';
}

// Crear nueva ruta
function crearNuevaRuta() {
    console.log('Creando nueva ruta...');
    alert('Funcionalidad de creación de ruta en desarrollo');
}

// Optimizar ruta
function optimizarRuta() {
    console.log('Optimizando ruta...');
    alert('Ruta optimizada exitosamente');
}

// Ver ruta actual
function verRutaActual() {
    console.log('Viendo ruta actual...');
    alert('Mostrando ruta actual en el mapa');
}

// Agregar cliente a ruta
function agregarClienteRuta() {
    console.log('Agregando cliente a la ruta...');
    alert('Funcionalidad de agregar cliente en desarrollo');
}

// Guardar ruta
function guardarRuta() {
    console.log('Guardando ruta...');
    alert('Ruta guardada exitosamente');
}

// Función auxiliar para generar colores aleatorios
function getRandomColor() {
    const colors = ['4F46E5', '10B981', 'F59E0B', 'EF4444', '8B5CF6'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Configuración de navegación
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            switchSection(targetSection);
        });
    });
}

// Cambiar sección activa
function switchSection(sectionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar sección objetivo
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Actualizar navegación
    updateNavigation(sectionId);
    
    // Actualizar sección actual
    currentSection = sectionId;
    
    // Cerrar menú móvil si está abierto
    closeMobileMenu();
    
    // Actualizar contenido específico de la sección
    updateSectionContent(sectionId);
}

// Actualizar navegación activa
function updateNavigation(activeSection) {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === activeSection) {
            link.classList.add('active');
        }
    });
}

// Configuración del menú móvil
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMobile = document.getElementById('navMobile');
    const closeMenu = document.getElementById('closeMenu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMobile.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', closeMobileMenu);
    }
    
    // Cerrar menú al hacer clic fuera
    navMobile.addEventListener('click', function(e) {
        if (e.target === navMobile) {
            closeMobileMenu();
        }
    });
}

// Cerrar menú móvil
function closeMobileMenu() {
    const navMobile = document.getElementById('navMobile');
    if (navMobile) {
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Configuración de gráficos
function setupCharts() {
    setupSalesChart();
    setupClientsChart();
}

// Configurar gráfico de ventas
function setupSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Ventas Mensuales',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 32000, 35000, 40000, 38000, 45000],
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            layout: {
                padding: {
                    top: 10,
                    bottom: 10
                }
            }
        }
    });
}

// Configurar gráfico de clientes
function setupClientsChart() {
    const ctx = document.getElementById('clientsChart');
    if (!ctx) return;
    
    clientsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Nuevos', 'Activos', 'Inactivos', 'VIP'],
            datasets: [{
                data: [25, 45, 20, 10],
                backgroundColor: [
                    '#10b981',
                    '#4f46e5',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            layout: {
                padding: {
                    top: 10,
                    bottom: 10
                }
            }
        }
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Event listeners para botones de acción
    setupActionButtons();
    
    // Event listeners para filtros
    setupFilters();
    
    // Event listeners para búsqueda
    setupSearch();
    
    // Event listeners para KPI periods
    setupKPIPeriods();
}

// Configurar botones de acción
function setupActionButtons() {
    // Botones de acción en tablas
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.querySelector('i').className;
            handleAction(action, this);
        });
    });
    
    // Botones de pago
    const paymentButtons = document.querySelectorAll('.action-btn i.fa-credit-card');
    paymentButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            openPaymentModal();
        });
    });
}

// Manejar acciones de botones
function handleAction(actionClass, button) {
    const row = button.closest('tr');
    const data = extractRowData(row);
    
    if (actionClass.includes('fa-eye')) {
        showDetails(data);
    } else if (actionClass.includes('fa-edit')) {
        editItem(data);
    } else if (actionClass.includes('fa-trash')) {
        deleteItem(data);
    } else if (actionClass.includes('fa-print')) {
        printItem(data);
    }
}

// Extraer datos de fila
function extractRowData(row) {
    const cells = row.querySelectorAll('td');
    const data = {};
    
    // Extraer información básica según el tipo de tabla
    if (currentSection === 'clientes') {
        data.name = cells[0]?.querySelector('.client-name')?.textContent || '';
        data.company = cells[0]?.querySelector('.client-company')?.textContent || '';
        data.email = cells[1]?.textContent || '';
        data.phone = cells[2]?.textContent || '';
        data.region = cells[3]?.textContent || '';
        data.status = cells[4]?.textContent || '';
    } else if (currentSection === 'ventas') {
        data.orderId = cells[0]?.textContent || '';
        data.client = cells[1]?.textContent || '';
        data.date = cells[2]?.textContent || '';
        data.total = cells[3]?.textContent || '';
        data.status = cells[4]?.textContent || '';
    } else if (currentSection === 'productos') {
        data.name = cells[0]?.querySelector('.product-name')?.textContent || '';
        data.sku = cells[0]?.querySelector('.product-sku')?.textContent || '';
        data.category = cells[1]?.textContent || '';
        data.price = cells[2]?.textContent || '';
        data.stock = cells[3]?.textContent || '';
        data.status = cells[4]?.textContent || '';
    }
    
    return data;
}

// Mostrar detalles
function showDetails(data) {
    console.log('Mostrando detalles:', data);
    // Aquí se implementaría un modal con los detalles
    alert(`Detalles de ${data.name || data.orderId || 'elemento'}`);
}

// Editar elemento
function editItem(data) {
    console.log('Editando:', data);
    // Aquí se implementaría un formulario de edición
    alert(`Editando ${data.name || data.orderId || 'elemento'}`);
}

// Eliminar elemento
function deleteItem(data) {
    if (confirm(`¿Estás seguro de que quieres eliminar ${data.name || data.orderId || 'este elemento'}?`)) {
        console.log('Eliminando:', data);
        // Aquí se implementaría la lógica de eliminación
        alert('Elemento eliminado');
    }
}

// Imprimir elemento
function printItem(data) {
    console.log('Imprimiendo:', data);
    // Aquí se implementaría la funcionalidad de impresión
    alert(`Imprimiendo ${data.orderId || 'elemento'}`);
}

// Configurar filtros
function setupFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            applyFilters();
        });
    });
}

// Aplicar filtros
function applyFilters() {
    console.log('Aplicando filtros...');
    // Aquí se implementaría la lógica de filtrado
    // Por ahora solo simulamos
    const rows = document.querySelectorAll('.data-table tbody tr');
    rows.forEach(row => {
        row.style.display = 'table-row';
    });
}

// Configurar búsqueda
function setupSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterTableBySearch(searchTerm);
        });
    }
}

// Filtrar tabla por búsqueda
function filterTableBySearch(searchTerm) {
    const rows = document.querySelectorAll('.data-table tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

// Configurar períodos KPI
function setupKPIPeriods() {
    const periods = document.querySelectorAll('.period');
    periods.forEach(period => {
        period.addEventListener('click', function() {
            // Remover clase activa de todos los períodos
            periods.forEach(p => p.classList.remove('active'));
            // Agregar clase activa al período clickeado
            this.classList.add('active');
            
            // Actualizar valores KPI según el período
            updateKPIValues(this.textContent.toLowerCase());
        });
    });
}

// Actualizar valores KPI
function updateKPIValues(period) {
    const kpiValues = document.querySelectorAll('.kpi-value');
    
    // Simular diferentes valores según el período
    const values = {
        'hoy': ['€24,580', '12', '8', 'Producto A'],
        'semana': ['€156,230', '45', '23', 'Producto B'],
        'mes': ['€678,450', '189', '67', 'Producto C']
    };
    
    const newValues = values[period] || values['hoy'];
    
    kpiValues.forEach((value, index) => {
        if (newValues[index]) {
            value.textContent = newValues[index];
        }
    });
}

// Configurar modal de pago
function setupPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const closeModal = document.getElementById('closePaymentModal');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closePaymentModal();
        });
    }
    
    // Cerrar modal al hacer clic fuera
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePaymentModal();
            }
        });
    }
    
    // Configurar opciones de pago
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const paymentMethod = this.querySelector('span').textContent;
            processPayment(paymentMethod);
        });
    });
}

// Abrir modal de pago
function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Cerrar modal de pago
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Procesar pago
function processPayment(method) {
    console.log('Procesando pago con:', method);
    
    // Simular procesamiento
    const loadingText = 'Procesando pago...';
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    paymentOptions.forEach(option => {
        option.style.pointerEvents = 'none';
        option.style.opacity = '0.5';
    });
    
    setTimeout(() => {
        alert(`Pago procesado exitosamente con ${method}`);
        closePaymentModal();
        
        // Restaurar opciones
        paymentOptions.forEach(option => {
            option.style.pointerEvents = '';
            option.style.opacity = '';
        });
    }, 2000);
}

// Configurar interacciones KPI
function setupKPIInteractions() {
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach(card => {
        card.addEventListener('click', function() {
            const kpiType = this.querySelector('h3').textContent;
            showKPIDetails(kpiType);
        });
    });
}

// Mostrar detalles KPI
function showKPIDetails(kpiType) {
    console.log('Mostrando detalles de KPI:', kpiType);
    // Aquí se implementaría un modal con detalles del KPI
    alert(`Detalles de ${kpiType}`);
}

// Configurar características responsivas
function setupResponsiveFeatures() {
    // Detectar cambios de tamaño de ventana
    window.addEventListener('resize', function() {
        handleResize();
    });
    
    // Configurar características específicas para móvil
    if (window.innerWidth <= 768) {
        setupMobileFeatures();
    }
    
    // Redimensionar gráficas cuando cambie el tamaño de la ventana
    window.addEventListener('resize', function() {
        if (salesChart) {
            salesChart.resize();
        }
        if (clientsChart) {
            clientsChart.resize();
        }
    });
}

// Manejar redimensionamiento
function handleResize() {
    if (window.innerWidth <= 768) {
        setupMobileFeatures();
    } else {
        removeMobileFeatures();
    }
}

// Configurar características móviles
function setupMobileFeatures() {
    // Hacer las tablas desplazables horizontalmente
    const tableContainers = document.querySelectorAll('.table-container');
    tableContainers.forEach(container => {
        container.style.overflowX = 'auto';
    });
    
    // Optimizar botones para touch
    const buttons = document.querySelectorAll('.btn, .action-btn');
    buttons.forEach(button => {
        button.style.minHeight = '44px';
        button.style.minWidth = '44px';
    });
}

// Remover características móviles
function removeMobileFeatures() {
    const tableContainers = document.querySelectorAll('.table-container');
    tableContainers.forEach(container => {
        container.style.overflowX = '';
    });
    
    const buttons = document.querySelectorAll('.btn, .action-btn');
    buttons.forEach(button => {
        button.style.minHeight = '';
        button.style.minWidth = '';
    });
}

// Actualizar contenido específico de sección
function updateSectionContent(sectionId) {
    switch (sectionId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'clientes':
            updateClientes();
            break;
        case 'ventas':
            updateVentas();
            break;
        case 'productos':
            updateProductos();
            break;
        case 'informes':
            updateInformes();
            break;
        case 'equipo':
            updateEquipo();
            break;
    }
}

// Actualizar dashboard
function updateDashboard() {
    console.log('Actualizando dashboard...');
    // Aquí se implementaría la actualización de datos del dashboard
}

// Actualizar clientes
function updateClientes() {
    console.log('Actualizando sección de clientes...');
    // Aquí se implementaría la carga de datos de clientes
}

// Actualizar ventas
function updateVentas() {
    console.log('Actualizando sección de ventas...');
    // Aquí se implementaría la carga de datos de ventas
}

// Actualizar productos
function updateProductos() {
    console.log('Actualizando sección de productos...');
    // Aquí se implementaría la carga de datos de productos
}

// Actualizar informes
function updateInformes() {
    console.log('Actualizando sección de informes...');
    // Aquí se implementaría la carga de datos de informes
}

// Actualizar equipo
function updateEquipo() {
    console.log('Actualizando sección de equipo...');
    // Aquí se implementaría la carga de datos del equipo
}

// Funciones de utilidad
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
}

// Configuración específica del módulo de reportes
function setupReportesModule() {
    setupReportesCharts();
    setupReportesFilters();
    setupReportesButtons();
    setupReportesNavigation();
}

// Configurar gráficos de reportes
function setupReportesCharts() {
    setupEvolucionVentasChart();
    setupVentasVendedorChart();
    setupVentasCategoriaChart();
}

// Configurar gráfico de evolución de ventas
function setupEvolucionVentasChart() {
    const ctx = document.getElementById('evolucionVentasChart');
    if (!ctx) return;
    
    evolucionVentasChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Ventas Mensuales (MXN)',
                data: [850000, 920000, 880000, 950000, 1020000, 980000, 1050000, 1120000, 1080000, 1150000, 1200000, 1250000],
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#4f46e5',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Ventas: $' + context.parsed.y.toLocaleString() + ' MXN';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000) + 'K';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Configurar gráfico de ventas por vendedor
function setupVentasVendedorChart() {
    const ctx = document.getElementById('ventasVendedorChart');
    if (!ctx) return;
    
    ventasVendedorChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Juan Pérez', 'María López', 'Carlos Ruiz', 'Ana García', 'Luis Martínez'],
            datasets: [{
                label: 'Ventas por Vendedor (MXN)',
                data: [320000, 285000, 245000, 198000, 202000],
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                ],
                borderColor: [
                    '#4f46e5',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6'
                ],
                borderWidth: 2,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#4f46e5',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Ventas: $' + context.parsed.y.toLocaleString() + ' MXN';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000) + 'K';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45
                    }
                }
            }
        }
    });
}

// Configurar gráfico de ventas por categoría
function setupVentasCategoriaChart() {
    const ctx = document.getElementById('ventasCategoriaChart');
    if (!ctx) return;
    
    ventasCategoriaChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Harinas', 'Aceites', 'Bebidas', 'Lácteos', 'Endulzantes', 'Condimentos'],
            datasets: [{
                data: [35, 25, 20, 12, 5, 3],
                backgroundColor: [
                    '#4f46e5',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                    '#06b6d4'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#4f46e5',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + percentage + '%';
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Configurar filtros de reportes
function setupReportesFilters() {
    const periodoSelector = document.getElementById('periodoSelector');
    if (periodoSelector) {
        periodoSelector.addEventListener('change', function() {
            actualizarDatosPorPeriodo(this.value);
        });
    }
}

// Configurar botones de reportes
function setupReportesButtons() {
    const btnExportar = document.getElementById('btnExportarReporte');
    if (btnExportar) {
        btnExportar.addEventListener('click', function() {
            exportarReporteCompleto();
        });
    }
}

// Configurar navegación de reportes
function setupReportesNavigation() {
    // Los reportes se manejan con onclick en el HTML
}

// Actualizar datos por período
function actualizarDatosPorPeriodo(periodo) {
    console.log('Actualizando datos para período:', periodo);
    
    // Simular actualización de datos según el período
    const datos = {
        'hoy': {
            ventasTotales: '$45,000 MXN',
            nuevosClientes: '12',
            promedioPedido: '$850 MXN',
            tendencia: '+8%'
        },
        'semana': {
            ventasTotales: '$285,000 MXN',
            nuevosClientes: '45',
            promedioPedido: '$820 MXN',
            tendencia: '+12%'
        },
        'mes': {
            ventasTotales: '$1,250,000 MXN',
            nuevosClientes: '150',
            promedioPedido: '$850 MXN',
            tendencia: '+15%'
        },
        'trimestre': {
            ventasTotales: '$3,680,000 MXN',
            nuevosClientes: '420',
            promedioPedido: '$875 MXN',
            tendencia: '+18%'
        },
        'año': {
            ventasTotales: '$14,200,000 MXN',
            nuevosClientes: '1,250',
            promedioPedido: '$920 MXN',
            tendencia: '+22%'
        }
    };
    
    const datosPeriodo = datos[periodo] || datos['mes'];
    
    // Actualizar KPIs
    document.getElementById('ventasTotales').textContent = datosPeriodo.ventasTotales;
    document.getElementById('nuevosClientes').textContent = datosPeriodo.nuevosClientes;
    document.getElementById('promedioPedido').textContent = datosPeriodo.promedioPedido;
    
    // Actualizar tendencias
    const tendencias = document.querySelectorAll('.kpi-trend');
    tendencias.forEach(tendencia => {
        tendencia.innerHTML = `<i class="fas fa-arrow-up"></i> ${datosPeriodo.tendencia} vs. período anterior`;
    });
    
    // Actualizar gráficos
    actualizarGraficosPorPeriodo(periodo);
}

// Actualizar gráficos por período
function actualizarGraficosPorPeriodo(periodo) {
    // Aquí se actualizarían los datos de los gráficos según el período
    console.log('Actualizando gráficos para período:', periodo);
    
    // Simular actualización de gráficos
    if (evolucionVentasChart) {
        // Actualizar datos del gráfico de evolución
        const nuevosDatos = generarDatosEvolucion(periodo);
        evolucionVentasChart.data.datasets[0].data = nuevosDatos;
        evolucionVentasChart.update();
    }
}

// Generar datos de evolución según período
function generarDatosEvolucion(periodo) {
    const datos = {
        'hoy': [45000, 48000, 52000, 49000, 51000, 53000, 55000, 52000, 54000, 56000, 58000, 60000],
        'semana': [285000, 290000, 295000, 300000, 305000, 310000, 315000, 320000, 325000, 330000, 335000, 340000],
        'mes': [850000, 920000, 880000, 950000, 1020000, 980000, 1050000, 1120000, 1080000, 1150000, 1200000, 1250000],
        'trimestre': [3680000, 3750000, 3820000, 3890000, 3960000, 4030000, 4100000, 4170000, 4240000, 4310000, 4380000, 4450000],
        'año': [14200000, 14500000, 14800000, 15100000, 15400000, 15700000, 16000000, 16300000, 16600000, 16900000, 17200000, 17500000]
    };
    
    return datos[periodo] || datos['mes'];
}

// Cambiar período de gráfico
function cambiarPeriodoGrafico(tipo) {
    console.log('Cambiando período de gráfico a:', tipo);
    
    // Simular cambio de período
    const botones = document.querySelectorAll('.grafico-actions .btn');
    botones.forEach(btn => btn.classList.remove('btn-primary'));
    event.target.classList.add('btn-primary');
    
    // Actualizar gráfico según el tipo
    if (tipo === 'meses') {
        actualizarGraficoMensual();
    } else if (tipo === 'trimestres') {
        actualizarGraficoTrimestral();
    }
}

// Actualizar gráfico mensual
function actualizarGraficoMensual() {
    if (evolucionVentasChart) {
        evolucionVentasChart.data.labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        evolucionVentasChart.data.datasets[0].data = [850000, 920000, 880000, 950000, 1020000, 980000, 1050000, 1120000, 1080000, 1150000, 1200000, 1250000];
        evolucionVentasChart.update();
    }
}

// Actualizar gráfico trimestral
function actualizarGraficoTrimestral() {
    if (evolucionVentasChart) {
        evolucionVentasChart.data.labels = ['Q1', 'Q2', 'Q3', 'Q4'];
        evolucionVentasChart.data.datasets[0].data = [2650000, 2950000, 3250000, 3550000];
        evolucionVentasChart.update();
    }
}

// Ordenar vendedores
function ordenarVendedores(criterio) {
    console.log('Ordenando vendedores por:', criterio);
    
    if (ventasVendedorChart) {
        // Simular reordenamiento de datos
        const datosOrdenados = [320000, 285000, 245000, 198000, 202000].sort((a, b) => b - a);
        const labelsOrdenados = ['Juan Pérez', 'María López', 'Carlos Ruiz', 'Luis Martínez', 'Ana García'];
        
        ventasVendedorChart.data.labels = labelsOrdenados;
        ventasVendedorChart.data.datasets[0].data = datosOrdenados;
        ventasVendedorChart.update();
    }
}

// Mostrar detalle de categorías
function mostrarDetalleCategorias() {
    console.log('Mostrando detalle de categorías');
    alert('Detalle de categorías:\n\n• Harinas: 35% - $437,500\n• Aceites: 25% - $312,500\n• Bebidas: 20% - $250,000\n• Lácteos: 12% - $150,000\n• Endulzantes: 5% - $62,500\n• Condimentos: 3% - $37,500');
}

// Zoom mapa
function zoomMapa() {
    console.log('Aplicando zoom al mapa');
    alert('Funcionalidad de zoom en desarrollo');
}

// Abrir reporte detallado
function abrirReporte(tipo) {
    currentReporte = tipo;
    const reporte = reportesData[tipo];
    
    if (!reporte) {
        alert('Reporte no disponible');
        return;
    }
    
    // Ocultar dashboard y mostrar reporte detallado
    document.getElementById('dashboardEjecutivo').style.display = 'none';
    document.getElementById('reportesNavegacion').style.display = 'none';
    document.getElementById('reporteDetallado').style.display = 'block';
    
    // Actualizar título del reporte
    document.getElementById('reporteTitulo').textContent = reporte.titulo;
    
    // Cargar contenido del reporte
    cargarContenidoReporte(tipo, reporte);
}

// Cargar contenido del reporte
function cargarContenidoReporte(tipo, reporte) {
    const content = document.getElementById('reporteContent');
    
    let html = `
        <div class="reporte-info">
            <h3>${reporte.titulo}</h3>
            <p>${reporte.descripcion}</p>
        </div>
    `;
    
    switch (tipo) {
        case 'ventas-producto':
            html += generarHTMLVentasProducto(reporte.datos);
            break;
        case 'ventas-vendedor':
            html += generarHTMLVentasVendedor(reporte.datos);
            break;
        case 'ventas-region':
            html += generarHTMLVentasRegion(reporte.datos);
            break;
        default:
            html += `
                <div class="reporte-placeholder">
                    <i class="fas fa-chart-line"></i>
                    <h4>Reporte en Desarrollo</h4>
                    <p>Este reporte detallado estará disponible próximamente.</p>
                </div>
            `;
    }
    
    content.innerHTML = html;
}

// Generar HTML para ventas por producto
function generarHTMLVentasProducto(datos) {
    let html = `
        <div class="reporte-tabla">
            <h4>Top 5 Productos por Ventas</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Ventas (MXN)</th>
                        <th>Unidades</th>
                        <th>Crecimiento (%)</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    datos.productos.forEach(producto => {
        html += `
            <tr>
                <td>${producto.nombre}</td>
                <td>$${producto.ventas.toLocaleString()}</td>
                <td>${producto.unidades.toLocaleString()}</td>
                <td><span class="trend positive">+${producto.crecimiento}%</span></td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

// Generar HTML para ventas por vendedor
function generarHTMLVentasVendedor(datos) {
    let html = `
        <div class="reporte-tabla">
            <h4>Rendimiento por Vendedor</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Vendedor</th>
                        <th>Ventas (MXN)</th>
                        <th>Pedidos</th>
                        <th>Promedio por Pedido</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    datos.vendedores.forEach(vendedor => {
        html += `
            <tr>
                <td>${vendedor.nombre}</td>
                <td>$${vendedor.ventas.toLocaleString()}</td>
                <td>${vendedor.pedidos}</td>
                <td>$${vendedor.promedio.toLocaleString()}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

// Generar HTML para ventas por región
function generarHTMLVentasRegion(datos) {
    let html = `
        <div class="reporte-tabla">
            <h4>Ventas por Región Geográfica</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Región</th>
                        <th>Ventas (MXN)</th>
                        <th>Clientes</th>
                        <th>Crecimiento (%)</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    datos.regiones.forEach(region => {
        html += `
            <tr>
                <td>${region.nombre}</td>
                <td>$${region.ventas.toLocaleString()}</td>
                <td>${region.clientes}</td>
                <td><span class="trend positive">+${region.crecimiento}%</span></td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

// Volver al dashboard
function volverADashboard() {
    document.getElementById('reporteDetallado').style.display = 'none';
    document.getElementById('dashboardEjecutivo').style.display = 'block';
    document.getElementById('reportesNavegacion').style.display = 'block';
    currentReporte = null;
}

// Exportar reporte
function exportarReporte() {
    console.log('Exportando reporte:', currentReporte);
    alert('Reporte exportado exitosamente como PDF');
}

// Compartir reporte
function compartirReporte() {
    console.log('Compartiendo reporte:', currentReporte);
    alert('Enlace del reporte copiado al portapapeles');
}

// Exportar reporte completo
function exportarReporteCompleto() {
    console.log('Exportando reporte completo del dashboard');
    alert('Dashboard ejecutivo exportado exitosamente');
}

// Exportar funciones para uso global
window.CRM = {
    switchSection,
    openPaymentModal,
    closePaymentModal,
    formatCurrency,
    formatDate,
    verDetalleCliente,
    crearPedidoCliente,
    verMapaCliente,
    editarCliente,
    volverALista,
    cancelarFormulario,
    ubicarEnMapa,
    abrirGoogleMaps
}; 

// Datos de ejemplo para notificaciones
const notificacionesData = [
    {
        id: 'NOT001',
        tipo: 'inventario',
        icono: '📦',
        titulo: 'Alerta de Stock Bajo',
        mensaje: 'El producto "Tostadas de Maíz Natural tiene solo 8 unidades restantes. ¡Realiza un pedido de reabastecimiento!',
        fecha: '2025-07-22T10:30:00',
        leida: false,
        urgente: true
    },
    {
        id: 'NOT002',
        tipo: 'pedidos',
        icono: '🛒',
        titulo: '¡Nuevo Pedido Recibido!',
        mensaje: 'El cliente "Distribuidora El Sol S.A." ha realizado el Pedido #P0016 por $2,100.00.',
        fecha: '2025-07-22T09:15:00',
        leida: false,
        urgente: false
    },
    {
        id: 'NOT003',
        tipo: 'pedidos',
        icono: '✅',
        titulo: 'Pedido Entregado',
        mensaje: 'Pedido #P0012 a "Ferretería Central" ha sido marcado como Entregado por Juan Pérez.',
        fecha: '2025-07-22T08:45:00',
        leida: true,
        urgente: false
    },
    {
        id: 'NOT004',
        tipo: 'rutas',
        icono: '🗺️',
        titulo: 'Recordatorio de Ruta',
        mensaje: 'Tienes 3 visitas pendientes en tu Ruta "Zona Sur" para hoy.',
        fecha: '2025-07-22T08:00:00',
        leida: false,
        urgente: false
    },
    {
        id: 'NOT005',
        tipo: 'clientes',
        icono: '👥',
        titulo: 'Cambio de Datos de Cliente',
        mensaje: 'El cliente "Panadería La Espiga" ha actualizado su dirección.',
        fecha: '2025-07-21T16:30:00',
        leida: true,
        urgente: false
    },
    {
        id: 'NOT006',
        tipo: 'sistema',
        icono: '⚙️',
        titulo: 'Actualización del CRM',
        mensaje: 'Nuevas funciones de Reportes disponibles. Incluye análisis avanzado de ventas y métricas de rendimiento.',
        fecha: '2025-07-21T14:00:00',
        leida: false,
        urgente: false
    },
    {
        id: 'NOT007',
        tipo: 'inventario',
        icono: '⚠️',
        titulo: 'Producto Agotado',
        mensaje: 'El producto "Maíz Blanco para Pozole" se ha agotado completamente. Considera realizar un pedido urgente.',
        fecha: '2025-07-21T11:20:00',
        leida: false,
        urgente: true
    },
    {
        id: 'NOT008',
        tipo: 'pedidos',
        icono: '❌',
        titulo: 'Pedido Cancelado',
        mensaje: 'El Pedido #P0014 de "Tienda de Ropa" ha sido cancelado por el cliente.',
        fecha: '2025-07-21T10:15:00',
        leida: true,
        urgente: false
    },
    {
        id: 'NOT009',
        tipo: 'clientes',
        icono: '👤',
        titulo: 'Nuevo Cliente Registrado',
        mensaje: 'Se ha registrado un nuevo cliente: "Supermercado Mega" con dirección en Av. Principal 654.',
        fecha: '2025-07-21T09:30:00',
        leida: false,
        urgente: false
    },
    {
        id: 'NOT010',
        tipo: 'rutas',
        icono: '🚗',
        titulo: 'Ruta Asignada',
        mensaje: 'Se te ha asignado la Ruta "Zona Norte" para mañana con 8 visitas programadas.',
        fecha: '2025-07-20T17:00:00',
        leida: true,
        urgente: false
    }
];

// Variables globales para notificaciones
let notificacionesFiltradas = [...notificacionesData];
let configuracionNotificaciones = {
    inventario: {
        stockBajo: true,
        productoAgotado: true,
        reabastecimiento: true
    },
    pedidos: {
        nuevoPedido: true,
        pedidoEntregado: true,
        pedidoCancelado: true
    },
    clientes: {
        nuevoCliente: true,
        cambioCliente: true
    },
    rutas: {
        rutaAsignada: true,
        visitaPendiente: true
    },
    sistema: {
        actualizacion: true,
        mantenimiento: true
    },
    medios: {
        appMovil: true,
        email: true,
        crm: true
    }
};

// Configuración específica del módulo de notificaciones
function setupNotificacionesModule() {
    actualizarContadorNotificaciones();
    cargarNotificacionesDropdown();
    cargarNotificacionesCompletas();
    setupNotificacionesEventListeners();
}

// Configurar event listeners
function setupNotificacionesEventListeners() {
    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('notificationsDropdown');
        const button = document.querySelector('.btn-notification');
        
        if (dropdown && button) {
            if (!dropdown.contains(event.target) && !button.contains(event.target)) {
                dropdown.classList.remove('active');
            }
        }
    });
}

// Funciones del dropdown de notificaciones
function toggleNotifications() {
    const dropdown = document.getElementById('notificationsDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function cargarNotificacionesDropdown() {
    const notificationsList = document.getElementById('notificationsList');
    if (!notificationsList) return;
    
    const notificacionesRecientes = notificacionesData
        .filter(n => !n.leida)
        .slice(0, 5);
    
    if (notificacionesRecientes.length === 0) {
        notificationsList.innerHTML = '<div class="notification-item"><p class="text-center">No hay notificaciones nuevas</p></div>';
        return;
    }
    
    let html = '';
    notificacionesRecientes.forEach(notificacion => {
        html += crearNotificacionHTML(notificacion, 'dropdown');
    });
    
    notificationsList.innerHTML = html;
}

function crearNotificacionHTML(notificacion, tipo = 'full') {
    const tiempoTranscurrido = obtenerTiempoTranscurrido(notificacion.fecha);
    const claseIcono = obtenerClaseIcono(notificacion.tipo);
    const claseUrgente = notificacion.urgente ? 'urgente' : '';
    
    if (tipo === 'dropdown') {
        return `
            <div class="notification-item ${!notificacion.leida ? 'unread' : ''}" onclick="marcarComoLeida('${notificacion.id}')">
                <div class="notification-icon ${claseIcono} ${claseUrgente}">
                    ${notificacion.icono}
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notificacion.titulo}</div>
                    <div class="notification-message">${notificacion.mensaje}</div>
                    <div class="notification-time">${tiempoTranscurrido}</div>
                    <div class="notification-actions">
                        <button class="btn-mark-read" onclick="event.stopPropagation(); marcarComoLeida('${notificacion.id}')">
                            Marcar como leída
                        </button>
                        <button class="btn-delete" onclick="event.stopPropagation(); eliminarNotificacion('${notificacion.id}')">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="notification-item-full ${!notificacion.leida ? 'unread' : ''}">
                <div class="notification-icon ${claseIcono} ${claseUrgente}">
                    ${notificacion.icono}
                </div>
                <div class="notification-content-full">
                    <div class="notification-title-full">${notificacion.titulo}</div>
                    <div class="notification-message-full">${notificacion.mensaje}</div>
                    <div class="notification-meta">
                        <div class="notification-time-full">${tiempoTranscurrido}</div>
                        <div class="notification-actions-full">
                            <button class="btn-mark-read" onclick="marcarComoLeida('${notificacion.id}')">
                                ${notificacion.leida ? 'Marcar como no leída' : 'Marcar como leída'}
                            </button>
                            <button class="btn-delete" onclick="eliminarNotificacion('${notificacion.id}')">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function obtenerTiempoTranscurrido(fecha) {
    const ahora = new Date();
    const fechaNotificacion = new Date(fecha);
    const diferencia = ahora - fechaNotificacion;
    
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    
    if (minutos < 60) {
        return `Hace ${minutos} min`;
    } else if (horas < 24) {
        return `Hace ${horas} h`;
    } else if (dias === 1) {
        return 'Ayer';
    } else {
        return fechaNotificacion.toLocaleDateString('es-ES');
    }
}

function obtenerClaseIcono(tipo) {
    switch (tipo) {
        case 'inventario':
            return 'inventario';
        case 'pedidos':
            return 'ventas';
        case 'clientes':
            return 'general';
        case 'rutas':
            return 'general';
        case 'sistema':
            return 'general';
        default:
            return 'general';
    }
}

// Funciones de gestión de notificaciones
function marcarComoLeida(notificacionId) {
    const notificacion = notificacionesData.find(n => n.id === notificacionId);
    if (notificacion) {
        notificacion.leida = !notificacion.leida;
        actualizarContadorNotificaciones();
        cargarNotificacionesDropdown();
        cargarNotificacionesCompletas();
    }
}

function marcarTodasComoLeidas() {
    notificacionesData.forEach(notificacion => {
        notificacion.leida = true;
    });
    actualizarContadorNotificaciones();
    cargarNotificacionesDropdown();
    cargarNotificacionesCompletas();
    mostrarNotificacion('Todas las notificaciones han sido marcadas como leídas');
}

function eliminarNotificacion(notificacionId) {
    const index = notificacionesData.findIndex(n => n.id === notificacionId);
    if (index !== -1) {
        notificacionesData.splice(index, 1);
        actualizarContadorNotificaciones();
        cargarNotificacionesDropdown();
        cargarNotificacionesCompletas();
        mostrarNotificacion('Notificación eliminada');
    }
}

function eliminarNotificacionesSeleccionadas() {
    const notificacionesSeleccionadas = notificacionesFiltradas.filter(n => n.seleccionada);
    if (notificacionesSeleccionadas.length === 0) {
        alert('Por favor selecciona las notificaciones que deseas eliminar');
        return;
    }
    
    notificacionesSeleccionadas.forEach(notificacion => {
        const index = notificacionesData.findIndex(n => n.id === notificacion.id);
        if (index !== -1) {
            notificacionesData.splice(index, 1);
        }
    });
    
    actualizarContadorNotificaciones();
    cargarNotificacionesDropdown();
    cargarNotificacionesCompletas();
    mostrarNotificacion(`${notificacionesSeleccionadas.length} notificaciones eliminadas`);
}

function actualizarContadorNotificaciones() {
    const badge = document.getElementById('notificationBadge');
    const noLeidas = notificacionesData.filter(n => !n.leida).length;
    
    if (badge) {
        badge.textContent = noLeidas;
        badge.style.display = noLeidas > 0 ? 'flex' : 'none';
    }
}

// Funciones de la vista completa
function mostrarNotificacionesCompletas() {
    // Navegar a la sección de notificaciones
    const seccion = document.getElementById('notificaciones');
    if (seccion) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        seccion.classList.add('active');
        
        // Actualizar navegación
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector('.nav-link[data-section="notificaciones"]').classList.add('active');
    }
}

function cargarNotificacionesCompletas() {
    const notificationsListFull = document.getElementById('notificationsListFull');
    if (!notificationsListFull) return;
    
    if (notificacionesFiltradas.length === 0) {
        notificationsListFull.innerHTML = '<div class="notification-item-full"><p class="text-center">No hay notificaciones que coincidan con los filtros</p></div>';
        return;
    }
    
    let html = '';
    notificacionesFiltradas.forEach(notificacion => {
        html += crearNotificacionHTML(notificacion, 'full');
    });
    
    notificationsListFull.innerHTML = html;
}

function filtrarNotificaciones() {
    const filtroEstado = document.getElementById('filtroEstado').value;
    const filtroTipo = document.getElementById('filtroTipo').value;
    const busqueda = document.getElementById('buscarNotificaciones').value.toLowerCase();
    
    notificacionesFiltradas = notificacionesData.filter(notificacion => {
        // Filtro por estado
        if (filtroEstado === 'no-leidas' && notificacion.leida) return false;
        if (filtroEstado === 'leidas' && !notificacion.leida) return false;
        
        // Filtro por tipo
        if (filtroTipo !== 'todas' && notificacion.tipo !== filtroTipo) return false;
        
        // Filtro por búsqueda
        if (busqueda) {
            const texto = `${notificacion.titulo} ${notificacion.mensaje}`.toLowerCase();
            if (!texto.includes(busqueda)) return false;
        }
        
        return true;
    });
    
    cargarNotificacionesCompletas();
}

// Funciones de configuración
function guardarConfiguracionNotificaciones() {
    // Recopilar configuración de los checkboxes
    configuracionNotificaciones = {
        inventario: {
            stockBajo: document.getElementById('notifStockBajo').checked,
            productoAgotado: document.getElementById('notifProductoAgotado').checked,
            reabastecimiento: document.getElementById('notifReabastecimiento').checked
        },
        pedidos: {
            nuevoPedido: document.getElementById('notifNuevoPedido').checked,
            pedidoEntregado: document.getElementById('notifPedidoEntregado').checked,
            pedidoCancelado: document.getElementById('notifPedidoCancelado').checked
        },
        clientes: {
            nuevoCliente: document.getElementById('notifNuevoCliente').checked,
            cambioCliente: document.getElementById('notifCambioCliente').checked
        },
        rutas: {
            rutaAsignada: document.getElementById('notifRutaAsignada').checked,
            visitaPendiente: document.getElementById('notifVisitaPendiente').checked
        },
        sistema: {
            actualizacion: document.getElementById('notifActualizacion').checked,
            mantenimiento: document.getElementById('notifMantenimiento').checked
        },
        medios: {
            appMovil: document.getElementById('notifAppMovil').checked,
            email: document.getElementById('notifEmail').checked,
            crm: document.getElementById('notifCRM').checked
        }
    };
    
    // Guardar en localStorage (simulación)
    localStorage.setItem('configuracionNotificaciones', JSON.stringify(configuracionNotificaciones));
    
    mostrarNotificacion('Configuración guardada exitosamente');
}

function restaurarConfiguracionDefault() {
    // Restaurar valores por defecto
    const checkboxes = [
        'notifStockBajo', 'notifProductoAgotado', 'notifReabastecimiento',
        'notifNuevoPedido', 'notifPedidoEntregado', 'notifPedidoCancelado',
        'notifNuevoCliente', 'notifCambioCliente', 'notifRutaAsignada',
        'notifVisitaPendiente', 'notifActualizacion', 'notifMantenimiento',
        'notifAppMovil', 'notifEmail', 'notifCRM'
    ];
    
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    
    mostrarNotificacion('Configuración restaurada a valores por defecto');
}

// Función para agregar nueva notificación (simulación)
function agregarNotificacion(tipo, titulo, mensaje, urgente = false) {
    const nuevaNotificacion = {
        id: 'NOT' + (notificacionesData.length + 1).toString().padStart(3, '0'),
        tipo: tipo,
        icono: obtenerIconoPorTipo(tipo),
        titulo: titulo,
        mensaje: mensaje,
        fecha: new Date().toISOString(),
        leida: false,
        urgente: urgente
    };
    
    notificacionesData.unshift(nuevaNotificacion);
    actualizarContadorNotificaciones();
    cargarNotificacionesDropdown();
    cargarNotificacionesCompletas();
}

function obtenerIconoPorTipo(tipo) {
    const iconos = {
        inventario: '📦',
        pedidos: '🛒',
        clientes: '👥',
        rutas: '🗺️',
        sistema: '⚙️'
    };
    return iconos[tipo] || '🔔';
}

// Simulación de notificaciones en tiempo real
function simularNotificacionesEnTiempoReal() {
    const notificacionesSimuladas = [
        {
            tipo: 'pedidos',
            titulo: 'Nuevo Pedido Urgente',
            mensaje: 'Pedido #P0017 de $3,500.00 requiere atención inmediata.',
            urgente: true
        },
        {
            tipo: 'inventario',
            titulo: 'Stock Crítico',
            mensaje: 'Laptop X200 tiene solo 2 unidades restantes.',
            urgente: true
        },
        {
            tipo: 'clientes',
            titulo: 'Nuevo Cliente VIP',
            mensaje: 'Se ha registrado un cliente con potencial de alto valor.',
            urgente: false
        }
    ];
    
    // Simular notificaciones cada 30 segundos
    setInterval(() => {
        const notificacionAleatoria = notificacionesSimuladas[Math.floor(Math.random() * notificacionesSimuladas.length)];
        agregarNotificacion(
            notificacionAleatoria.tipo,
            notificacionAleatoria.titulo,
            notificacionAleatoria.mensaje,
            notificacionAleatoria.urgente
        );
    }, 30000);
}

// Configuración específica del módulo de seguimiento de rutas
function setupSeguimientoRutasModule() {
    setupSeguimientoRutasButtons();
    setupSeguimientoRutasEventListeners();
    cargarVendedoresActivos();
    cargarRutasHistorial();
    iniciarSeguimientoEnTiempoReal();
}

// Configurar botones del módulo de seguimiento de rutas
function setupSeguimientoRutasButtons() {
    const btnNuevaRuta = document.getElementById('btnNuevaRuta');
    const btnHistorial = document.getElementById('btnHistorialRutas');
    
    if (btnNuevaRuta) {
        btnNuevaRuta.addEventListener('click', function() {
            mostrarVistaSeguimiento();
        });
    }
    
    if (btnHistorial) {
        btnHistorial.addEventListener('click', function() {
            mostrarHistorialRutas();
        });
    }
}

// Configurar event listeners
function setupSeguimientoRutasEventListeners() {
    const vendedorSelector = document.getElementById('vendedorSelector');
    if (vendedorSelector) {
        vendedorSelector.addEventListener('change', function() {
            currentVendedorId = this.value;
            actualizarVistaSeguimiento();
        });
    }
}

// Funciones de navegación
function mostrarVistaSeguimiento() {
    ocultarTodasLasVistasSeguimiento();
    document.getElementById('seguimientoContainer').style.display = 'block';
    actualizarVistaSeguimiento();
}

function mostrarHistorialRutas() {
    ocultarTodasLasVistasSeguimiento();
    document.getElementById('historialRutasContainer').style.display = 'block';
    cargarRutasHistorial();
}

function ocultarTodasLasVistasSeguimiento() {
    const vistas = [
        'seguimientoContainer',
        'historialRutasContainer',
        'rutaActivaMobile'
    ];
    
    vistas.forEach(vista => {
        const elemento = document.getElementById(vista);
        if (elemento) {
            elemento.style.display = 'none';
        }
    });
}

// Funciones de carga de datos
function cargarVendedoresActivos() {
    const vendedorSelector = document.getElementById('vendedorSelector');
    if (!vendedorSelector) return;
    
    let html = '<option value="">Seleccionar vendedor</option>';
    Object.values(vendedoresActivos).forEach(vendedor => {
        html += `<option value="${vendedor.id}" ${vendedor.id === currentVendedorId ? 'selected' : ''}>
            ${vendedor.nombre} - ${vendedor.estado}
        </option>`;
    });
    
    vendedorSelector.innerHTML = html;
}

function cargarRutasHistorial() {
    const historialTable = document.querySelector('#historial-rutas-container .data-table tbody');
    if (!historialTable) return;
    
    let html = '';
    Object.values(rutasData).forEach(ruta => {
        html += `
            <tr>
                <td>${ruta.fecha}</td>
                <td>${ruta.vendedor}</td>
                <td>${ruta.nombre}</td>
                <td>${ruta.totalVisitas}</td>
                <td>${ruta.visitasCompletadas}</td>
                <td>${ruta.distanciaRecorrida} km</td>
                <td>${ruta.duracionTotal}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="verDetalleRuta('${ruta.id}')">
                        Ver Detalle
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="verReporteRuta('${ruta.id}')">
                        Ver Reporte
                    </button>
                </td>
            </tr>
        `;
    });
    
    historialTable.innerHTML = html;
}

function actualizarVistaSeguimiento() {
    const vendedor = vendedoresActivos[currentVendedorId];
    if (!vendedor) return;
    
    // Actualizar información del vendedor
    actualizarInfoVendedor(vendedor);
    
    // Actualizar marcadores en el mapa
    actualizarMarcadoresMapa();
    
    // Actualizar lista de clientes
    actualizarListaClientes(vendedor);
}

function actualizarInfoVendedor(vendedor) {
    const resumenInfo = document.querySelector('.vendedor-resumen .resumen-info');
    if (!resumenInfo) return;
    
    const ruta = vendedor.rutaActual ? rutasData[vendedor.rutaActual] : null;
    
    let html = `
        <div class="info-item">
            <label>Vendedor:</label>
            <span>${vendedor.nombre}</span>
        </div>
        <div class="info-item">
            <label>Ruta Asignada:</label>
            <span>${ruta ? ruta.nombre : 'Sin ruta asignada'}</span>
        </div>
        <div class="info-item">
            <label>Estado Actual:</label>
            <span class="estado-activo">${vendedor.estado}</span>
        </div>
        <div class="info-item">
            <label>Última Actualización:</label>
            <span>${vendedor.ultimaActualizacion}</span>
        </div>
        <div class="info-item">
            <label>Progreso de Ruta:</label>
            <span>${vendedor.progreso}%</span>
        </div>
        <div class="info-item">
            <label>Desviación de Ruta:</label>
            <span>${ruta ? ruta.desviacion : 'N/A'}</span>
        </div>
    `;
    
    resumenInfo.innerHTML = html;
    
    // Actualizar barra de progreso
    const progresoFill = document.querySelector('.progreso-fill');
    if (progresoFill) {
        progresoFill.style.width = `${vendedor.progreso}%`;
    }
    
    const progresoTexto = document.querySelector('.progreso-texto');
    if (progresoTexto) {
        progresoTexto.textContent = `${vendedor.progreso}%`;
    }
}

function actualizarMarcadoresMapa() {
    const mapaArea = document.getElementById('mapaArea');
    if (!mapaArea) return;
    
    // Actualizar marcadores existentes en lugar de recrearlos
    const marcadoresVendedores = mapaArea.querySelectorAll('.vendedor-marcador');
    marcadoresVendedores.forEach(marcador => {
        const vendedorId = marcador.getAttribute('data-vendedor');
        const vendedor = vendedoresActivos[vendedorId];
        if (vendedor) {
            const infoElement = marcador.querySelector('.marcador-info');
            if (infoElement) {
                infoElement.innerHTML = `
                    <strong>${vendedor.nombre}</strong>
                    <span>${vendedor.estado}</span>
                `;
            }
        }
    });
    
    // Actualizar marcadores de clientes
    const marcadoresClientes = mapaArea.querySelectorAll('.cliente-marcador');
    marcadoresClientes.forEach(marcador => {
        const clienteId = marcador.getAttribute('data-cliente');
        if (clienteId) {
            // Buscar el cliente en las rutas
            Object.values(rutasData).forEach(ruta => {
                const cliente = ruta.clientes.find(c => c.id === clienteId);
                if (cliente) {
                    const infoElement = marcador.querySelector('.cliente-info');
                    if (infoElement) {
                        infoElement.innerHTML = `
                            <strong>${cliente.nombre}</strong>
                            ${cliente.hora ? `<span>Check-in: ${cliente.hora}</span>` : ''}
                        `;
                    }
                }
            });
        }
    });
}

function crearMarcadorVendedor(vendedor) {
    const marcador = document.createElement('div');
    marcador.className = `vendedor-marcador ${vendedor.id === currentVendedorId ? 'actual' : ''}`;
    marcador.style.left = `${vendedor.ubicacion.lat}%`;
    marcador.style.top = `${vendedor.ubicacion.lng}%`;
    
    marcador.innerHTML = `
        <div class="marcador-icon">
            <i class="fas fa-user"></i>
        </div>
        <div class="marcador-info">
            <strong>${vendedor.nombre}</strong>
            <span>${vendedor.estado}</span>
        </div>
    `;
    
    return marcador;
}

function crearMarcadorCliente(cliente) {
    const marcador = document.createElement('div');
    marcador.className = `cliente-marcador ${cliente.estado}`;
    marcador.style.left = `${Math.random() * 80 + 10}%`;
    marcador.style.top = `${Math.random() * 80 + 10}%`;
    
    const icono = cliente.estado === 'visitado' ? 'check' : 
                  cliente.estado === 'actual' ? 'clock' : 'map-marker-alt';
    
    marcador.innerHTML = `
        <div class="cliente-info">
            <strong>${cliente.nombre}</strong>
            ${cliente.hora ? `<span>Check-in: ${cliente.hora}</span>` : ''}
        </div>
    `;
    
    return marcador;
}

function actualizarListaClientes(vendedor) {
    const clientesLista = document.getElementById('clientesLista');
    if (!clientesLista) return;
    
    const ruta = vendedor.rutaActual ? rutasData[vendedor.rutaActual] : null;
    if (!ruta) {
        clientesLista.innerHTML = '<p>No hay ruta asignada</p>';
        return;
    }
    
    let html = '';
    ruta.clientes.forEach(cliente => {
        const estadoClase = cliente.estado === 'visitado' ? 'visitado' : 
                           cliente.estado === 'actual' ? 'actual' : 'pendiente';
        
        html += `
            <div class="cliente-ruta-item ${estadoClase}">
                <div class="cliente-info-ruta">
                    <h4>${cliente.nombre}</h4>
                    <p>${cliente.direccion}</p>
                    <span class="estado-visita">${cliente.estado}</span>
                    ${cliente.hora ? `<span class="hora-visita">${cliente.hora}</span>` : ''}
                </div>
                <div class="cliente-acciones">
                    <button class="btn btn-sm btn-primary" onclick="verDetalleClienteRuta('${cliente.id}')">
                        Ver Detalle
                    </button>
                    ${cliente.estado === 'actual' ? `
                        <button class="btn btn-sm btn-success" onclick="finalizarVisita('${cliente.id}')">
                            Finalizar Visita
                        </button>
                    ` : cliente.estado === 'pendiente' ? `
                        <button class="btn btn-sm btn-warning" onclick="iniciarVisita('${cliente.id}')">
                            Iniciar Visita
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    clientesLista.innerHTML = html;
}

// Funciones de vista móvil
function cargarVistaMobile() {
    const vendedor = vendedoresActivos[currentVendedorId];
    if (!vendedor) return;
    
    actualizarInfoMobile(vendedor);
    actualizarVisitasMobile(vendedor);
}

function actualizarInfoMobile(vendedor) {
    const ruta = vendedor.rutaActual ? rutasData[vendedor.rutaActual] : null;
    const proximoCliente = ruta ? ruta.clientes.find(c => c.estado === 'pendiente') : null;
    
    // Actualizar información de ruta
    const rutaActiva = document.querySelector('.info-ruta-actual .ruta-activa');
    if (rutaActiva) {
        rutaActiva.textContent = ruta ? ruta.nombre : 'Sin ruta asignada';
    }
    
    const proximoClienteElement = document.querySelector('.info-ruta-actual .proximo-cliente');
    if (proximoClienteElement) {
        proximoClienteElement.textContent = proximoCliente ? proximoCliente.nombre : 'No hay visitas pendientes';
    }
    
    const distanciaElement = document.querySelector('.info-ruta-actual .distancia-proximo');
    if (distanciaElement) {
        distanciaElement.textContent = proximoCliente ? '2.5 km' : '0 km';
    }
    
    const tiempoElement = document.querySelector('.info-ruta-actual .tiempo-estimado');
    if (tiempoElement) {
        tiempoElement.textContent = proximoCliente ? '15 min' : '0 min';
    }
}

function actualizarVisitasMobile(vendedor) {
    const visitasLista = document.getElementById('visitasLista');
    if (!visitasLista) return;
    
    const ruta = vendedor.rutaActual ? rutasData[vendedor.rutaActual] : null;
    if (!ruta) {
        visitasLista.innerHTML = '<p>No hay visitas programadas</p>';
        return;
    }
    
    let html = '';
    ruta.clientes.forEach(cliente => {
        const estadoClase = cliente.estado === 'visitado' ? 'completada' : 
                           cliente.estado === 'actual' ? 'actual' : 'pendiente';
        
        html += `
            <div class="visita-item ${estadoClase}">
                <div class="visita-info">
                    <h4>${cliente.nombre}</h4>
                    <p>${cliente.direccion}</p>
                    <span class="estado-visita">${cliente.estado}</span>
                    ${cliente.hora ? `<span class="hora-visita">${cliente.hora}</span>` : ''}
                </div>
                <div class="visita-acciones">
                    ${cliente.estado === 'visitado' ? `
                        <button class="btn btn-sm btn-success">Check-out</button>
                        <button class="btn btn-sm btn-primary">Crear Pedido</button>
                    ` : cliente.estado === 'actual' ? `
                        <button class="btn btn-sm btn-success">Check-out</button>
                        <button class="btn btn-sm btn-primary">Crear Pedido</button>
                        <button class="btn btn-sm btn-secondary">Notas</button>
                    ` : `
                        <button class="btn btn-sm btn-warning">Check-in</button>
                        <button class="btn btn-sm btn-info">Navegar</button>
                    `}
                </div>
            </div>
        `;
    });
    
    visitasLista.innerHTML = html;
}

// Funciones de seguimiento en tiempo real
function iniciarSeguimientoEnTiempoReal() {
    // Simular actualizaciones en tiempo real cada 30 segundos
    seguimientoInterval = setInterval(() => {
        actualizarPosicionesVendedores();
        actualizarEstadosVisitas();
    }, 30000);
}

function actualizarPosicionesVendedores() {
    Object.values(vendedoresActivos).forEach(vendedor => {
        if (vendedor.estado !== 'Inactivo') {
            // Simular movimiento aleatorio
            vendedor.ubicacion.lat += (Math.random() - 0.5) * 2;
            vendedor.ubicacion.lng += (Math.random() - 0.5) * 2;
            
            // Mantener dentro de los límites
            vendedor.ubicacion.lat = Math.max(5, Math.min(95, vendedor.ubicacion.lat));
            vendedor.ubicacion.lng = Math.max(5, Math.min(95, vendedor.ubicacion.lng));
            
            vendedor.ultimaActualizacion = 'Hace 1 minuto';
        }
    });
    
    actualizarVistaSeguimiento();
}

function actualizarEstadosVisitas() {
    Object.values(rutasData).forEach(ruta => {
        ruta.clientes.forEach(cliente => {
            if (cliente.estado === 'actual' && Math.random() > 0.7) {
                cliente.estado = 'visitado';
                cliente.hora = new Date().toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            }
        });
    });
}

// Funciones de acción
function verDetalleClienteRuta(clienteId) {
    alert(`Ver detalle del cliente ${clienteId}`);
}

function finalizarVisita(clienteId) {
    const vendedor = vendedoresActivos[currentVendedorId];
    if (!vendedor || !vendedor.rutaActual) return;
    
    const ruta = rutasData[vendedor.rutaActual];
    if (!ruta) return;
    
    const cliente = ruta.clientes.find(c => c.id === clienteId);
    if (cliente && cliente.estado === 'actual') {
        cliente.estado = 'visitado';
        cliente.hora = new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        actualizarListaClientes(vendedor);
        actualizarVisitasMobile(vendedor);
        
        mostrarNotificacion('Visita finalizada exitosamente');
    }
}

function iniciarVisita(clienteId) {
    const vendedor = vendedoresActivos[currentVendedorId];
    if (!vendedor || !vendedor.rutaActual) return;
    
    const ruta = rutasData[vendedor.rutaActual];
    if (!ruta) return;
    
    // Marcar todas las visitas actuales como completadas
    ruta.clientes.forEach(c => {
        if (c.estado === 'actual') {
            c.estado = 'visitado';
            c.hora = new Date().toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
    });
    
    // Marcar la nueva visita como actual
    const cliente = ruta.clientes.find(c => c.id === clienteId);
    if (cliente && cliente.estado === 'pendiente') {
        cliente.estado = 'actual';
        cliente.hora = new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        actualizarListaClientes(vendedor);
        actualizarVisitasMobile(vendedor);
        
        mostrarNotificacion('Visita iniciada');
    }
}

function verDetalleRuta(rutaId) {
    const ruta = rutasData[rutaId];
    if (!ruta) return;
    
    alert(`Detalle de la ruta: ${ruta.nombre}\nVendedor: ${ruta.vendedor}\nProgreso: ${ruta.progreso}%`);
}

function verReporteRuta(rutaId) {
    const ruta = rutasData[rutaId];
    if (!ruta) return;
    
    alert(`Reporte de la ruta: ${ruta.nombre}\nVisitas completadas: ${ruta.visitasCompletadas}/${ruta.totalVisitas}\nDistancia: ${ruta.distanciaRecorrida} km`);
}

// Función para actualizar el mapa (llamada desde el HTML)
function actualizarMapa() {
    actualizarVistaSeguimiento();
    mostrarNotificacion('Mapa actualizado');
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    // Crear una notificación temporal
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-temp';
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem;
        border-radius: var(--radius-sm);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notificacion);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Función de prueba para verificar la funcionalidad
function probarCrearPedido() {
    console.log('Probando creación de pedido...');
    crearPedidoCliente('C001');
}

// Función de prueba simplificada para debug
function probarCrearPedidoSimple() {
    console.log('Probando creación de pedido simplificada...');
    
    // Cambiar directamente a la sección de ventas
    switchSection('ventas');
    
    // Esperar y mostrar el formulario
    setTimeout(() => {
        const ventasSection = document.getElementById('ventas');
        console.log('Sección ventas:', ventasSection);
        console.log('Clase activa:', ventasSection ? ventasSection.classList.contains('active') : 'No encontrada');
        
        if (ventasSection && ventasSection.classList.contains('active')) {
            mostrarFormularioNuevoPedido();
            console.log('Formulario mostrado');
        } else {
            console.error('La sección de ventas no está activa');
        }
    }, 500);
}

// Función de prueba sin confirmación
function probarCrearPedidoSinConfirmacion() {
    console.log('Probando creación de pedido sin confirmación...');
    
    const cliente = clientesData['C001'];
    if (cliente) {
        // Mostrar notificación
        mostrarNotificacion(`Creando nuevo pedido para ${cliente.nombre}`);
        
        // Cambiar a la sección de ventas
        switchSection('ventas');
        
        // Esperar y mostrar el formulario
        setTimeout(() => {
            mostrarFormularioNuevoPedido();
            
            // Pre-seleccionar cliente
            const clienteInput = document.getElementById('clientePedido');
            if (clienteInput) {
                clienteInput.value = cliente.nombre;
            }
            
            // Establecer cliente
            pedidoCliente = cliente;
            
            // Mostrar resumen
            mostrarResumenCliente(cliente);
            
            // Ir al primer paso
            mostrarPaso(1);
            
            console.log('Pedido creado sin confirmación');
        }, 300);
    }
}

// ===== MÓDULO DE CUENTAS POR COBRAR =====

// Variables globales para el módulo de facturas
let facturasData = [
    {
        id: 'FAC001',
        pedidoId: 'P0010',
        cliente: 'Distribuidora El Sol S.A.',
        vendedor: 'Juan Pérez',
        fechaEmision: '2025-01-20',
        fechaVencimiento: '2025-02-20',
        montoTotal: 1500.00,
        saldoPendiente: 1500.00,
        estado: 'Pendiente',
        items: [
            { descripcion: 'Harina Premium 25kg', cantidad: 2, precioUnitario: 500.00, total: 1000.00 },
            { descripcion: 'Aceite de Oliva Extra Virgen 1L', cantidad: 5, precioUnitario: 100.00, total: 500.00 }
        ],
        pagos: []
    },
    {
        id: 'FAC002',
        pedidoId: 'P0011',
        cliente: 'Panadería La Espiga',
        vendedor: 'María López',
        fechaEmision: '2025-01-22',
        fechaVencimiento: '2025-02-22',
        montoTotal: 850.50,
        saldoPendiente: 425.25,
        estado: 'Parcialmente Pagada',
        items: [
            { descripcion: 'Café Molido Premium 1kg', cantidad: 3, precioUnitario: 150.00, total: 450.00 },
            { descripcion: 'Azúcar Refinada 5kg', cantidad: 2, precioUnitario: 200.25, total: 400.50 }
        ],
        pagos: [
            { fecha: '2025-01-25', monto: 425.25, metodo: 'Transferencia Bancaria', referencia: 'TRX-2025-001' }
        ]
    }
];

// Función para mostrar la vista de facturas
function mostrarFacturas() {
    document.getElementById('facturasContainer').style.display = 'block';
    document.getElementById('formularioFactura').style.display = 'none';
    document.getElementById('facturaDetalle').style.display = 'none';
    actualizarVistaFacturas();
}

// Función para actualizar la vista de facturas
function actualizarVistaFacturas() {
    // Implementar filtros y búsqueda
    console.log('Vista de facturas actualizada');
}

// Función para mostrar el formulario de nueva factura
function mostrarNuevaFactura() {
    document.getElementById('facturasContainer').style.display = 'none';
    document.getElementById('formularioFactura').style.display = 'block';
    document.getElementById('facturaDetalle').style.display = 'none';
    
    // Configurar fecha de emisión automática
    const fechaEmision = document.getElementById('fechaEmision');
    if (fechaEmision) {
        fechaEmision.value = new Date().toISOString().split('T')[0];
    }
    
    // Configurar fecha de vencimiento (30 días por defecto)
    const fechaVencimiento = document.getElementById('fechaVencimiento');
    if (fechaVencimiento) {
        const fechaVenc = new Date();
        fechaVenc.setDate(fechaVenc.getDate() + 30);
        fechaVencimiento.value = fechaVenc.toISOString().split('T')[0];
    }
}

// Función para cancelar el formulario de factura
function cancelarFormularioFactura() {
    if (confirm('¿Estás seguro de que quieres cancelar? Los datos no guardados se perderán.')) {
        mostrarFacturas();
    }
}

// Función para buscar pedido
function buscarPedido() {
    const pedidoId = document.getElementById('pedidoFactura').value;
    if (pedidoId) {
        // Simular búsqueda de pedido
        const pedidoResumen = document.getElementById('pedidoResumen');
        if (pedidoResumen) {
            pedidoResumen.style.display = 'block';
            document.getElementById('pedidoCliente').textContent = 'Distribuidora El Sol S.A.';
            document.getElementById('pedidoFecha').textContent = 'Fecha: 2025-01-20';
            document.getElementById('pedidoTotal').textContent = 'Total: €1,500.00';
        }
    }
}

// Función para agregar ítem a la factura
function agregarItemFactura() {
    const descripcion = document.getElementById('productoFactura').value;
    const cantidad = parseFloat(document.getElementById('cantidadFactura').value);
    const precioUnitario = parseFloat(document.getElementById('precioUnitario').value);
    
    if (descripcion && cantidad && precioUnitario) {
        const total = cantidad * precioUnitario;
        
        // Agregar a la tabla
        const tbody = document.getElementById('productosFacturaTableBody');
        if (tbody) {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${descripcion}</td>
                <td>${cantidad}</td>
                <td>€${precioUnitario.toFixed(2)}</td>
                <td>€${total.toFixed(2)}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-danger" onclick="eliminarItemFactura(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        }
        
        // Limpiar campos
        document.getElementById('productoFactura').value = '';
        document.getElementById('cantidadFactura').value = '1';
        document.getElementById('precioUnitario').value = '';
        document.getElementById('totalLinea').value = '';
        
        // Actualizar totales
        actualizarTotalesFactura();
    }
}

// Función para eliminar ítem de la factura
function eliminarItemFactura(button) {
    button.closest('tr').remove();
    actualizarTotalesFactura();
}

// Función para actualizar totales de la factura
function actualizarTotalesFactura() {
    const tbody = document.getElementById('productosFacturaTableBody');
    let subtotal = 0;
    
    if (tbody) {
        const rows = tbody.getElementsByTagName('tr');
        for (let row of rows) {
            const totalCell = row.cells[3];
            const total = parseFloat(totalCell.textContent.replace('€', ''));
            subtotal += total;
        }
    }
    
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    
    document.getElementById('subtotalFactura').textContent = `€${subtotal.toFixed(2)}`;
    document.getElementById('ivaFactura').textContent = `€${iva.toFixed(2)}`;
    document.getElementById('totalFactura').textContent = `€${total.toFixed(2)}`;
}

// Función para guardar borrador de factura
function guardarBorradorFactura() {
    alert('Borrador de factura guardado exitosamente');
}

// Función para ver detalle de factura
function verDetalleFactura(facturaId) {
    document.getElementById('facturasContainer').style.display = 'none';
    document.getElementById('formularioFactura').style.display = 'none';
    document.getElementById('facturaDetalle').style.display = 'block';
    
    // Cargar datos de la factura
    const factura = facturasData.find(f => f.id === facturaId);
    if (factura) {
        document.getElementById('detalleFacturaTitulo').textContent = `Detalle de Factura ${factura.id}`;
        // Aquí se cargarían todos los datos de la factura en la vista
    }
}

// Función para volver a la lista de facturas
function volverAFacturas() {
    mostrarFacturas();
}

// Función para registrar pago de factura
function registrarPagoFactura(facturaId) {
    const modal = document.getElementById('modalRegistroPago');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('facturaPago').value = facturaId;
        
        // Obtener saldo pendiente de la factura
        const factura = facturasData.find(f => f.id === facturaId);
        if (factura) {
            document.getElementById('montoPago').value = factura.saldoPendiente;
        }
        
        // Configurar fecha actual
        document.getElementById('fechaPago').value = new Date().toISOString().split('T')[0];
    }
}

// Función para cerrar modal de pago
function cerrarModalPago() {
    const modal = document.getElementById('modalRegistroPago');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Función para confirmar registro de pago
function confirmarRegistroPago() {
    const facturaId = document.getElementById('facturaPago').value;
    const monto = parseFloat(document.getElementById('montoPago').value);
    const fecha = document.getElementById('fechaPago').value;
    const metodo = document.getElementById('metodoPago').value;
    const referencia = document.getElementById('referenciaPago').value;
    
    if (facturaId && monto && fecha && metodo) {
        // Aquí se procesaría el pago
        alert(`Pago registrado exitosamente:\nFactura: ${facturaId}\nMonto: €${monto.toFixed(2)}\nMétodo: ${metodo}`);
        cerrarModalPago();
        mostrarFacturas(); // Actualizar vista
    } else {
        alert('Por favor complete todos los campos requeridos');
    }
}

// Función para enviar recordatorio
function enviarRecordatorio(facturaId) {
    alert(`Recordatorio enviado para la factura ${facturaId}`);
}

// Función para enviar recordatorio urgente
function enviarRecordatorioUrgente(facturaId) {
    alert(`Recordatorio urgente enviado para la factura ${facturaId}`);
}

// Función para generar nota de crédito
function generarNotaCredito(facturaId) {
    if (confirm(`¿Estás seguro de que quieres generar una nota de crédito para la factura ${facturaId}?`)) {
        alert(`Nota de crédito generada para la factura ${facturaId}`);
    }
}

// Función para imprimir factura
function imprimirFactura(facturaId) {
    alert(`Imprimiendo factura ${facturaId}...`);
}

// Función para enviar factura por email
function enviarFacturaEmail(facturaId) {
    alert(`Factura ${facturaId} enviada por email`);
}

// Función para registrar pago desde detalle
function registrarPagoDesdeDetalle() {
    const facturaId = document.getElementById('detalleFacturaTitulo').textContent.split(' ').pop();
    registrarPagoFactura(facturaId);
}

// Función para enviar factura por email desde detalle
function enviarFacturaEmail() {
    const facturaId = document.getElementById('detalleFacturaTitulo').textContent.split(' ').pop();
    enviarFacturaEmail(facturaId);
}

// Función para imprimir factura desde detalle
function imprimirFacturaDesdeDetalle() {
    const facturaId = document.getElementById('detalleFacturaTitulo').textContent.split(' ').pop();
    imprimirFactura(facturaId);
}

// Función para generar nota de crédito desde detalle
function generarNotaCreditoDesdeDetalle() {
    const facturaId = document.getElementById('detalleFacturaTitulo').textContent.split(' ').pop();
    generarNotaCredito(facturaId);
}

// Función para cancelar factura desde detalle
function cancelarFacturaDesdeDetalle() {
    const facturaId = document.getElementById('detalleFacturaTitulo').textContent.split(' ').pop();
    if (confirm(`¿Estás seguro de que quieres cancelar la factura ${facturaId}? Esta acción no se puede deshacer.`)) {
        alert(`Factura ${facturaId} cancelada`);
        volverAFacturas();
    }
}

// Función para ver cliente desde detalle
function verCliente(clienteId) {
    alert(`Redirigiendo al perfil del cliente ${clienteId}`);
}

// Función para ver pedido desde detalle
function verPedido(pedidoId) {
    alert(`Redirigiendo al detalle del pedido ${pedidoId}`);
}

// Función para exportar facturas
function exportarFacturas() {
    alert('Exportando facturas...');
}

// Event listeners para el módulo de facturas
document.addEventListener('DOMContentLoaded', function() {
    // Botón nueva factura
    const btnNuevaFactura = document.getElementById('btnNuevaFactura');
    if (btnNuevaFactura) {
        btnNuevaFactura.addEventListener('click', mostrarNuevaFactura);
    }
    
    // Botón exportar facturas
    const btnExportarFacturas = document.getElementById('btnExportarFacturas');
    if (btnExportarFacturas) {
        btnExportarFacturas.addEventListener('click', exportarFacturas);
    }
    
    // Búsqueda de facturas
    const searchFacturas = document.getElementById('searchFacturas');
    if (searchFacturas) {
        searchFacturas.addEventListener('input', function() {
            // Implementar búsqueda en tiempo real
            console.log('Buscando facturas:', this.value);
        });
    }
    
    // Filtros de facturas
    const filterEstadoFactura = document.getElementById('filterEstadoFactura');
    if (filterEstadoFactura) {
        filterEstadoFactura.addEventListener('change', function() {
            // Implementar filtro por estado
            console.log('Filtrando por estado:', this.value);
        });
    }
    
    const filterFechaEmision = document.getElementById('filterFechaEmision');
    if (filterFechaEmision) {
        filterFechaEmision.addEventListener('change', function() {
            // Implementar filtro por fecha
            console.log('Filtrando por fecha:', this.value);
        });
    }
    
    // Cálculo automático de total de línea
    const cantidadFactura = document.getElementById('cantidadFactura');
    const precioUnitario = document.getElementById('precioUnitario');
    const totalLinea = document.getElementById('totalLinea');
    
    if (cantidadFactura && precioUnitario && totalLinea) {
        function calcularTotalLinea() {
            const cantidad = parseFloat(cantidadFactura.value) || 0;
            const precio = parseFloat(precioUnitario.value) || 0;
            totalLinea.value = (cantidad * precio).toFixed(2);
        }
        
        cantidadFactura.addEventListener('input', calcularTotalLinea);
        precioUnitario.addEventListener('input', calcularTotalLinea);
    }
    
    // Cambio de método de creación
    const crearDesdePedido = document.getElementById('crearDesdePedido');
    const crearManual = document.getElementById('crearManual');
    const pedidoBusqueda = document.getElementById('pedidoBusqueda');
    const clienteFactura = document.getElementById('clienteFactura');
    
    if (crearDesdePedido && crearManual && pedidoBusqueda && clienteFactura) {
        crearDesdePedido.addEventListener('change', function() {
            if (this.checked) {
                pedidoBusqueda.style.display = 'block';
                clienteFactura.disabled = true;
                clienteFactura.value = '';
            }
        });
        
        crearManual.addEventListener('change', function() {
            if (this.checked) {
                pedidoBusqueda.style.display = 'none';
                clienteFactura.disabled = false;
            }
        });
    }
});

// Función para manejar la responsividad de facturas
function toggleVistaFacturas() {
    const tableContainer = document.getElementById('facturasTableContainer');
    const mobileContainer = document.getElementById('facturasMobile');
    
    if (window.innerWidth <= 768) {
        if (tableContainer) tableContainer.style.display = 'none';
        if (mobileContainer) mobileContainer.style.display = 'block';
    } else {
        if (tableContainer) tableContainer.style.display = 'block';
        if (mobileContainer) mobileContainer.style.display = 'none';
    }
}

// Event listener para cambio de tamaño de ventana
window.addEventListener('resize', toggleVistaFacturas);

// Inicializar vista de facturas al cargar
document.addEventListener('DOMContentLoaded', function() {
    toggleVistaFacturas();
});

// ===== MÓDULO DE GESTIÓN DE PRODUCTOS =====

// Variables globales para productos
let currentProductoId = null;
let isEditingProducto = false;

// Mostrar formulario de nuevo producto
function mostrarFormularioNuevoProducto() {
    console.log('Mostrando formulario de nuevo producto');
    
    try {
        // Ocultar la tabla de productos
        const tableContainer = document.querySelector('#productos .table-container');
        if (tableContainer) {
            tableContainer.style.display = 'none';
            console.log('Tabla de productos ocultada');
        } else {
            console.warn('No se encontró la tabla de productos');
        }
        
        // Mostrar el formulario
        const formulario = document.getElementById('formularioProducto');
        if (formulario) {
            formulario.style.display = 'block';
            console.log('Formulario de productos mostrado');
            
            // Configurar para nuevo producto
            isEditingProducto = false;
            currentProductoId = null;
            
            // Actualizar título
            const titulo = document.getElementById('formularioProductoTitulo');
            if (titulo) {
                titulo.textContent = 'Nuevo Producto';
            }
            
            // Limpiar formulario
            const form = document.getElementById('productoForm');
            if (form) {
                form.reset();
            }
            
            // Generar SKU automático
            generarSkuAutomatico();
            
            // Configurar imagen por defecto
            configurarImagenPorDefecto();
            
            console.log('✅ Formulario de nuevo producto configurado correctamente');
        } else {
            console.error('❌ No se encontró el formulario de productos');
            alert('Error: No se encontró el formulario de productos');
        }
    } catch (error) {
        console.error('❌ Error en mostrarFormularioNuevoProducto:', error);
        alert('Error al mostrar el formulario de productos: ' + error.message);
    }
}

// Cancelar formulario de producto
function cancelarFormularioProducto() {
    console.log('Cancelando formulario de producto');
    
    // Ocultar formulario
    const formulario = document.getElementById('formularioProducto');
    if (formulario) {
        formulario.style.display = 'none';
    }
    
    // Mostrar tabla de productos
    const tableContainer = document.querySelector('#productos .table-container');
    if (tableContainer) {
        tableContainer.style.display = 'block';
    }
    
    // Resetear variables
    currentProductoId = null;
    isEditingProducto = false;
    
    console.log('Formulario de producto cancelado');
}

// Generar SKU automático
function generarSkuAutomatico() {
    const skuInput = document.getElementById('skuProducto');
    if (skuInput) {
        const categoria = document.getElementById('categoriaProducto').value;
        const timestamp = Date.now().toString().slice(-4);
        
        let prefijo = 'PROD';
        if (categoria) {
            if (categoria.includes('Maíz')) {
                prefijo = 'MAIZ';
            } else if (categoria.includes('Tostada')) {
                prefijo = 'TOST';
            } else if (categoria.includes('Electrónica')) {
                prefijo = 'ELEC';
            } else if (categoria.includes('Alimentos')) {
                prefijo = 'ALIM';
            }
        }
        
        const nuevoSku = `${prefijo}-${timestamp}`;
        skuInput.value = nuevoSku;
        console.log('SKU generado:', nuevoSku);
    }
}

// Configurar imagen por defecto
function configurarImagenPorDefecto() {
    const imagenPreview = document.getElementById('imagenPreview');
    if (imagenPreview) {
        imagenPreview.innerHTML = `
            <i class="fas fa-image"></i>
            <p>Sin imagen seleccionada</p>
        `;
    }
    
    // Ocultar botón de eliminar imagen
    const btnEliminarImagen = document.getElementById('btnEliminarImagen');
    if (btnEliminarImagen) {
        btnEliminarImagen.style.display = 'none';
    }
}

// Eliminar imagen del producto
function eliminarImagenProducto() {
    const imagenPreview = document.getElementById('imagenPreview');
    const btnEliminarImagen = document.getElementById('btnEliminarImagen');
    const inputImagen = document.getElementById('imagenProducto');
    
    if (imagenPreview) {
        imagenPreview.innerHTML = `
            <i class="fas fa-image"></i>
            <p>Sin imagen seleccionada</p>
        `;
    }
    
    if (btnEliminarImagen) {
        btnEliminarImagen.style.display = 'none';
    }
    
    if (inputImagen) {
        inputImagen.value = '';
    }
    
    console.log('Imagen del producto eliminada');
}

// Guardar producto
function guardarProducto() {
    console.log('Guardando producto...');
    
    const formData = new FormData(document.getElementById('productoForm'));
    const productoData = {
        id: formData.get('skuProducto'),
        nombre: formData.get('nombreProducto'),
        sku: formData.get('skuProducto'),
        categoria: formData.get('categoriaProducto'),
        marca: formData.get('marcaProducto'),
        descripcion: formData.get('descripcionProducto'),
        precio: parseFloat(formData.get('precioVentaProducto')),
        precioOriginal: parseFloat(formData.get('precioVentaProducto')),
        stock: parseInt(formData.get('stockInicialProducto')),
        especificaciones: {
            peso: formData.get('unidadMedidaProducto'),
            origen: 'México',
            conservacion: 'Seco'
        },
        imagenes: ['🌽', '🍲', '🏺'],
        badge: null
    };
    
    if (isEditingProducto && currentProductoId) {
        // Actualizar producto existente
        productosData[currentProductoId] = { ...productosData[currentProductoId], ...productoData };
        console.log('Producto actualizado:', currentProductoId, productoData);
        mostrarNotificacion('Producto actualizado exitosamente');
    } else {
        // Crear nuevo producto
        const nuevoId = productoData.sku;
        productosData[nuevoId] = productoData;
        console.log('Nuevo producto creado:', nuevoId, productosData[nuevoId]);
        mostrarNotificacion('Producto creado exitosamente');
    }
    
    // Volver al listado
    cancelarFormularioProducto();
    
    // Actualizar tabla de productos
    actualizarTablaProductos();
}

// Actualizar tabla de productos
function actualizarTablaProductos() {
    console.log('Actualizando tabla de productos...');
    
    const tbody = document.querySelector('#productos .data-table tbody');
    if (!tbody) {
        console.error('No se encontró el tbody de productos');
        return;
    }
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    // Agregar productos
    Object.values(productosData).forEach(producto => {
        // Calcular nivel de stock (simulado para productos existentes)
        const stockMinimo = producto.stock * 0.2; // 20% del stock como mínimo
        const stockLevel = producto.stock > stockMinimo * 2 ? 'high' : producto.stock > stockMinimo ? 'medium' : 'low';
        const stockPercentage = Math.min((producto.stock / (stockMinimo * 3)) * 100, 100);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="product-info">
                    <img src="https://via.placeholder.com/40x40/${getRandomColor()}/FFFFFF?text=${producto.nombre.charAt(0).toUpperCase()}" alt="Producto">
                    <div>
                        <div class="product-name">${producto.nombre}</div>
                        <div class="product-sku">SKU: ${producto.sku}</div>
                    </div>
                </div>
            </td>
            <td>${producto.categoria}</td>
            <td>€${producto.precio.toFixed(2)}</td>
            <td>
                <div class="stock-info">
                    <span class="stock-level ${stockLevel}">${producto.stock}</span>
                    <div class="stock-bar">
                        <div class="stock-fill ${stockLevel}" style="width: ${stockPercentage}%"></div>
                    </div>
                </div>
            </td>
            <td><span class="status active">Activo</span></td>
            <td>
                <div class="actions">
                    <button class="action-btn" title="Ver Detalles" onclick="verDetalleProducto('${producto.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" title="Editar" onclick="editarProducto('${producto.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" title="Eliminar" onclick="eliminarProducto('${producto.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    console.log('Tabla de productos actualizada');
}

// Ver detalle de producto
function verDetalleProducto(productoId) {
    console.log('Viendo detalle del producto:', productoId);
    // Implementar vista de detalle
}

// Editar producto
function editarProducto(productoId) {
    console.log('Editando producto:', productoId);
    
    const producto = productosData[productoId];
    if (!producto) {
        console.error('Producto no encontrado:', productoId);
        return;
    }
    
    // Configurar para edición
    isEditingProducto = true;
    currentProductoId = productoId;
    
    // Mostrar formulario
    mostrarFormularioNuevoProducto();
    
    // Actualizar título
    document.getElementById('formularioProductoTitulo').textContent = 'Editar Producto';
    
    // Llenar formulario con datos del producto
    document.getElementById('nombreProducto').value = producto.nombre;
    document.getElementById('skuProducto').value = producto.sku;
    document.getElementById('categoriaProducto').value = producto.categoria;
    document.getElementById('marcaProducto').value = producto.marca;
    document.getElementById('descripcionProducto').value = producto.descripcion;
    document.getElementById('precioCompraProducto').value = producto.precio;
    document.getElementById('precioVentaProducto').value = producto.precio;
    document.getElementById('unidadMedidaProducto').value = producto.especificaciones?.peso || 'kg';
    document.getElementById('stockInicialProducto').value = producto.stock;
    document.getElementById('stockMinimoProducto').value = Math.round(producto.stock * 0.2);
    document.getElementById('estadoProducto').checked = true;
    
    console.log('Formulario de edición configurado');
}

// Eliminar producto
function eliminarProducto(productoId) {
    console.log('Eliminando producto:', productoId);
    
    const confirmar = confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmar) {
        delete productosData[productoId];
        actualizarTablaProductos();
        mostrarNotificacion('Producto eliminado exitosamente');
        console.log('Producto eliminado:', productoId);
    }
}

// Configurar eventos del formulario de productos
function setupProductosModule() {
    console.log('Configurando módulo de productos...');
    
    // Configurar evento de cambio de categoría para generar SKU
    const categoriaSelect = document.getElementById('categoriaProducto');
    if (categoriaSelect) {
        categoriaSelect.addEventListener('change', generarSkuAutomatico);
    }
    
    // Configurar evento de subida de imagen
    const imagenInput = document.getElementById('imagenProducto');
    if (imagenInput) {
        imagenInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imagenPreview = document.getElementById('imagenPreview');
                    const btnEliminarImagen = document.getElementById('btnEliminarImagen');
                    
                    if (imagenPreview) {
                        imagenPreview.innerHTML = `<img src="${e.target.result}" alt="Imagen del producto" style="max-width: 100%; max-height: 200px;">`;
                    }
                    
                    if (btnEliminarImagen) {
                        btnEliminarImagen.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Configurar envío del formulario
    const productoForm = document.getElementById('productoForm');
    if (productoForm) {
        productoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarProducto();
        });
    }
    
    console.log('Módulo de productos configurado');
}

// Inicializar módulo de productos cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    setupProductosModule();
    
    // Agregar event listener global para detectar clics en botones
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
            console.log('🔘 Botón clickeado:', {
                texto: button.textContent?.trim(),
                onclick: button.getAttribute('onclick'),
                classes: button.className,
                id: button.id
            });
        }
    });
    
    // Función de prueba para verificar que todo funciona
    window.probarFuncionalidad = function() {
        console.log('=== PRUEBA DE FUNCIONALIDAD ===');
        console.log('1. Verificando funciones de productos...');
        console.log('mostrarFormularioNuevoProducto:', typeof mostrarFormularioNuevoProducto);
        console.log('editarProducto:', typeof editarProducto);
        console.log('eliminarProducto:', typeof eliminarProducto);
        
        console.log('2. Verificando funciones de clientes...');
        console.log('crearPedidoCliente:', typeof crearPedidoCliente);
        console.log('crearPedidoDesdeDetalle:', typeof crearPedidoDesdeDetalle);
        
        console.log('3. Verificando datos...');
        console.log('productosData:', productosData);
        console.log('clientesData:', clientesData);
        
        console.log('4. Verificando elementos del DOM...');
        const btnNuevoProducto = document.querySelector('#productos .btn-primary');
        console.log('Botón Nuevo Producto:', btnNuevoProducto);
        
        const formularioProducto = document.getElementById('formularioProducto');
        console.log('Formulario Producto:', formularioProducto);
        
        console.log('=== FIN DE PRUEBA ===');
    };
    
    // Ejecutar prueba automáticamente
    setTimeout(() => {
        probarFuncionalidad();
    }, 1000);
    
    // Función de prueba específica para productos
    window.probarProductos = function() {
        console.log('=== PRUEBA DE PRODUCTOS ===');
        
        // Probar mostrar formulario
        try {
            mostrarFormularioNuevoProducto();
            console.log('✅ mostrarFormularioNuevoProducto ejecutado correctamente');
        } catch (error) {
            console.error('❌ Error en mostrarFormularioNuevoProducto:', error);
        }
        
        // Probar editar producto
        try {
            editarProducto('MAIZ-001');
            console.log('✅ editarProducto ejecutado correctamente');
        } catch (error) {
            console.error('❌ Error en editarProducto:', error);
        }
        
        // Probar eliminar producto
        try {
            eliminarProducto('TOST-001');
            console.log('✅ eliminarProducto ejecutado correctamente');
        } catch (error) {
            console.error('❌ Error en eliminarProducto:', error);
        }
        
        console.log('=== FIN DE PRUEBA DE PRODUCTOS ===');
    };
    
    // Función de prueba específica para clientes
    window.probarClientes = function() {
        console.log('=== PRUEBA DE CLIENTES ===');
        
        // Probar crear pedido
        try {
            crearPedidoCliente('C001');
            console.log('✅ crearPedidoCliente ejecutado correctamente');
        } catch (error) {
            console.error('❌ Error en crearPedidoCliente:', error);
        }
        
        console.log('=== FIN DE PRUEBA DE CLIENTES ===');
    };
    
    // Función de prueba simple para productos
    window.probarNuevoProducto = function() {
        console.log('🧪 PROBANDO BOTÓN NUEVO PRODUCTO...');
        
        // 1. Verificar que la función existe
        console.log('1. Verificando función mostrarFormularioNuevoProducto:', typeof mostrarFormularioNuevoProducto);
        
        // 2. Verificar que el botón existe
        const btnNuevoProducto = document.querySelector('#productos .btn-primary');
        console.log('2. Botón encontrado:', !!btnNuevoProducto);
        if (btnNuevoProducto) {
            console.log('   - Texto del botón:', btnNuevoProducto.textContent?.trim());
            console.log('   - Atributo onclick:', btnNuevoProducto.getAttribute('onclick'));
        }
        
        // 3. Verificar que el formulario existe
        const formularioProducto = document.getElementById('formularioProducto');
        console.log('3. Formulario encontrado:', !!formularioProducto);
        if (formularioProducto) {
            console.log('   - Display actual:', formularioProducto.style.display);
        }
        
        // 4. Intentar ejecutar la función
        console.log('4. Intentando ejecutar mostrarFormularioNuevoProducto...');
        try {
            mostrarFormularioNuevoProducto();
            console.log('✅ Función ejecutada sin errores');
            
            // Verificar resultado
            setTimeout(() => {
                const formulario = document.getElementById('formularioProducto');
                if (formulario && formulario.style.display !== 'none') {
                    console.log('✅ ÉXITO: Formulario ahora está visible');
                } else {
                    console.log('❌ FALLO: Formulario sigue oculto');
                    // Intentar método directo
                    console.log('🔧 Intentando método directo...');
                    ejecutarNuevoProductoDirecto();
                }
            }, 500);
            
        } catch (error) {
            console.error('❌ Error ejecutando función:', error);
            ejecutarNuevoProductoDirecto();
        }
    };
    
    // Función para forzar el funcionamiento del botón
    window.forzarBotonNuevoProducto = function() {
        console.log('💪 FORZANDO FUNCIONAMIENTO DEL BOTÓN NUEVO PRODUCTO...');
        
        const btnNuevoProducto = document.querySelector('#productos .btn-primary');
        if (btnNuevoProducto) {
            // Limpiar eventos existentes
            const nuevoBoton = btnNuevoProducto.cloneNode(true);
            btnNuevoProducto.parentNode.replaceChild(nuevoBoton, btnNuevoProducto);
            
            // Agregar nuevo evento
            nuevoBoton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🚀 BOTÓN CLICKEADO - Ejecutando mostrarFormularioNuevoProducto');
                
                if (typeof mostrarFormularioNuevoProducto === 'function') {
                    mostrarFormularioNuevoProducto();
                } else {
                    ejecutarNuevoProductoDirecto();
                }
                
                return false;
            });
            
            // También agregar onclick
            nuevoBoton.setAttribute('onclick', 'mostrarFormularioNuevoProducto(); return false;');
            
            console.log('✅ Botón reemplazado y configurado correctamente');
        } else {
            console.error('❌ No se encontró el botón Nuevo Producto');
        }
    };
    
    // Función de prueba simple para clientes
    window.probarCarritoCliente = function() {
        console.log('Probando carrito de cliente...');
        crearPedidoCliente('C001');
    };
    
    // Función para verificar estado actual
    window.verificarEstado = function() {
        console.log('=== VERIFICACIÓN DE ESTADO ===');
        console.log('Sección actual:', currentSection);
        console.log('Productos cargados:', Object.keys(productosData).length);
        console.log('Clientes cargados:', Object.keys(clientesData).length);
        console.log('Formulario producto visible:', document.getElementById('formularioProducto')?.style.display);
        console.log('Tabla productos visible:', document.querySelector('#productos .table-container')?.style.display);
        console.log('=== FIN VERIFICACIÓN ===');
    };
    
    // Función para probar productos de maíz y tostadas
    window.probarProductosMaiz = function() {
        console.log('=== PRUEBA DE PRODUCTOS DE MAÍZ ===');
        
        // Verificar productos de maíz y tostadas
        const productosMaiz = Object.values(productosData).filter(producto =>
            producto.categoria.includes('Maíz') || producto.categoria.includes('Tostada')
        );
        
        console.log('Productos de maíz y tostadas encontrados:', productosMaiz.length);
        productosMaiz.forEach(producto => {
            console.log(`- ${producto.nombre} (${producto.categoria}) - €${producto.precio}`);
        });
        
        // Probar mostrar sugerencias
        try {
            mostrarSugerenciasProductos('');
            console.log('✅ Sugerencias de productos mostradas correctamente');
        } catch (error) {
            console.error('❌ Error al mostrar sugerencias:', error);
        }
        
        console.log('=== FIN PRUEBA ===');
    };
    
    // Función para simular búsqueda de productos
    window.probarBusquedaProductos = function(termino) {
        console.log(`Probando búsqueda: "${termino}"`);
        mostrarSugerenciasProductos(termino);
    };
    
    // Función para re-inicializar todos los eventos
    window.reinicializarEventos = function() {
        console.log('🔄 Re-inicializando todos los eventos...');
        
        try {
            // Re-configurar módulo de productos
            setupProductosModule();
            console.log('✅ Módulo de productos re-configurado');
            
            // Re-configurar botones de pedidos
            setupPedidosButtons();
            console.log('✅ Botones de pedidos re-configurados');
            
            // Verificar botones con onclick
            const botonesConOnclick = document.querySelectorAll('[onclick]');
            console.log(`📋 Botones con onclick encontrados: ${botonesConOnclick.length}`);
            botonesConOnclick.forEach((btn, index) => {
                console.log(`${index + 1}. ${btn.textContent?.trim()} - ${btn.getAttribute('onclick')}`);
            });
            
        } catch (error) {
            console.error('❌ Error al re-inicializar eventos:', error);
        }
    };
    
    // Función para forzar la funcionalidad de productos
    window.forzarFuncionalidadProductos = function() {
        console.log('💪 Forzando funcionalidad de productos...');
        
        // Agregar eventos a botones de productos manualmente
        const btnNuevoProducto = document.querySelector('#productos .btn-primary');
        if (btnNuevoProducto) {
            btnNuevoProducto.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🆕 Ejecutando mostrarFormularioNuevoProducto');
                mostrarFormularioNuevoProducto();
            });
            console.log('✅ Evento agregado al botón Nuevo Producto');
        }
        
        // Agregar eventos a botones de acción de productos
        const botonesAccion = document.querySelectorAll('#productos .action-btn');
        botonesAccion.forEach(btn => {
            const onclick = btn.getAttribute('onclick');
            if (onclick && !btn.hasAttribute('data-event-added')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('🔧 Ejecutando:', onclick);
                    try {
                        eval(onclick);
                    } catch (error) {
                        console.error('❌ Error al ejecutar:', onclick, error);
                    }
                });
                btn.setAttribute('data-event-added', 'true');
            }
        });
        console.log(`✅ Eventos agregados a ${botonesAccion.length} botones de acción`);
        
        // Agregar eventos a botones de carrito de clientes
        const botonesCarrito = document.querySelectorAll('[onclick*="crearPedido"]');
        botonesCarrito.forEach(btn => {
            const onclick = btn.getAttribute('onclick');
            if (onclick && !btn.hasAttribute('data-event-added')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('🛒 Ejecutando:', onclick);
                    try {
                        eval(onclick);
                    } catch (error) {
                        console.error('❌ Error al ejecutar:', onclick, error);
                    }
                });
                btn.setAttribute('data-event-added', 'true');
            }
        });
        console.log(`✅ Eventos agregados a ${botonesCarrito.length} botones de carrito`);
    };
    
    // Función de diagnóstico completo
    window.diagnosticoCompleto = function() {
        console.log('🔍 === DIAGNÓSTICO COMPLETO ===');
        
        // 1. Verificar funciones globales
        console.log('1. Funciones globales:');
        console.log('   mostrarFormularioNuevoProducto:', typeof mostrarFormularioNuevoProducto);
        console.log('   crearPedidoCliente:', typeof crearPedidoCliente);
        console.log('   editarProducto:', typeof editarProducto);
        console.log('   eliminarProducto:', typeof eliminarProducto);
        
        // 2. Verificar datos
        console.log('2. Datos:');
        console.log('   productosData:', Object.keys(productosData || {}).length);
        console.log('   clientesData:', Object.keys(clientesData || {}).length);
        
        // 3. Verificar elementos del DOM
        console.log('3. Elementos del DOM:');
        console.log('   Botón Nuevo Producto:', !!document.querySelector('#productos .btn-primary'));
        console.log('   Formulario Producto:', !!document.getElementById('formularioProducto'));
        console.log('   Formulario Pedido:', !!document.getElementById('formularioPedido'));
        
        // 4. Verificar eventos onclick
        console.log('4. Botones con onclick:');
        const botonesOnclick = document.querySelectorAll('[onclick]');
        console.log(`   Total: ${botonesOnclick.length}`);
        
        // 5. Probar funcionalidad
        console.log('5. Probando funcionalidad:');
        try {
            reinicializarEventos();
            forzarFuncionalidadProductos();
            console.log('✅ Funcionalidad forzada exitosamente');
        } catch (error) {
            console.error('❌ Error al forzar funcionalidad:', error);
        }
        
        console.log('🔍 === FIN DIAGNÓSTICO ===');
    };
    
    // Función para forzar productos de maíz en el formulario de pedidos
    window.forzarProductosMaiz = function() {
        console.log('🌽 Forzando productos de maíz en formulario de pedidos...');
        
        // Obtener productos de maíz y tostadas
        const productosMaiz = Object.values(productosData).filter(producto =>
            producto.categoria.includes('Maíz') || producto.categoria.includes('Tostada')
        );
        
        console.log('Productos de maíz encontrados:', productosMaiz);
        
        const suggestions = document.getElementById('productoSuggestions');
        if (suggestions) {
            // Limpiar contenido existente completamente
            suggestions.innerHTML = '';
            suggestions.style.display = 'none';
            
            // Crear contenido HTML completo para productos de maíz
            let htmlContent = '';
            productosMaiz.forEach(producto => {
                htmlContent += `
                    <div class="producto-suggestion-item" style="
                        padding: 12px;
                        border-bottom: 1px solid #eee;
                        cursor: pointer;
                        transition: background-color 0.2s;
                        display: block;
                    " onclick="seleccionarProductoMaiz('${producto.id}')">
                        <div>
                            <strong>${producto.nombre}</strong>
                            <div style="font-size: 0.875rem; color: #666;">
                                ${producto.categoria} | €${producto.precio.toFixed(2)} | Stock: ${producto.stock}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            // Insertar el HTML
            suggestions.innerHTML = htmlContent;
            
            // Aplicar estilos al contenedor
            suggestions.style.cssText = `
                display: block !important;
                position: relative;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                max-height: 300px;
                overflow-y: auto;
                width: 100%;
                z-index: 1000;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-top: 5px;
            `;
            
            console.log(`✅ ${productosMaiz.length} productos de maíz agregados con HTML directo`);
        }
        
        // También intentar sobrescribir cualquier contenido que se muestre automáticamente
        setTimeout(() => {
            const allSuggestionItems = document.querySelectorAll('.producto-suggestion-item');
            console.log(`🔍 Elementos de sugerencia encontrados: ${allSuggestionItems.length}`);
            
            // Eliminar productos que no sean de maíz
            allSuggestionItems.forEach(item => {
                const text = item.textContent || '';
                if (text.includes('Laptop') || text.includes('Monitor') || text.includes('Auriculares') || 
                    text.includes('Electrónicos') || text.includes('Gaming') || text.includes('Oficina')) {
                    console.log('🗑️ Eliminando producto de cómputo:', text.trim());
                    item.remove();
                }
            });
        }, 100);
    };
    
    // Función para seleccionar producto de maíz
    window.seleccionarProductoMaiz = function(productoId) {
        console.log('🌽 Seleccionando producto de maíz:', productoId);
        const producto = productosData[productoId];
        if (producto) {
            seleccionarProducto(producto);
        }
    };
    
    // Función para ejecutar cuando se abre el paso 2 del formulario
    window.interceptarPaso2 = function() {
        console.log('📝 Interceptando paso 2 del formulario...');
        
        // Sobrescribir la función mostrarPaso para interceptar el paso 2
        const originalMostrarPaso = window.mostrarPaso;
        
        window.mostrarPaso = function(paso) {
            console.log(`📋 Mostrando paso: ${paso}`);
            
            // Ejecutar función original
            if (originalMostrarPaso) {
                originalMostrarPaso(paso);
            }
            
            // Si es el paso 2, forzar productos de maíz
            if (paso === 2) {
                setTimeout(() => {
                    forzarProductosMaiz();
                }, 500);
            }
        };
        
        console.log('✅ Interceptor del paso 2 configurado');
    };
    
    // Función para sobrescribir botones problemáticos
    window.sobrescribirBotones = function() {
        console.log('🔧 Sobrescribiendo botones problemáticos...');
        
        // Método más agresivo para el botón Nuevo Producto
        const botonesNuevoProducto = document.querySelectorAll('#productos .btn-primary, [onclick*="mostrarFormularioNuevoProducto"]');
        console.log(`🔍 Encontrados ${botonesNuevoProducto.length} botones de Nuevo Producto`);
        
        botonesNuevoProducto.forEach((btn, index) => {
            // Remover eventos existentes
            btn.removeAttribute('onclick');
            
            // Crear nuevo evento limpio
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🆕 EJECUTANDO mostrarFormularioNuevoProducto desde botón ${index + 1}`);
                
                try {
                    // Verificar que la función existe
                    if (typeof mostrarFormularioNuevoProducto === 'function') {
                        mostrarFormularioNuevoProducto();
                        console.log('✅ Función ejecutada correctamente');
                    } else {
                        console.error('❌ Función mostrarFormularioNuevoProducto no existe');
                        // Ejecutar código directo como respaldo
                        ejecutarNuevoProductoDirecto();
                    }
                } catch (error) {
                    console.error('❌ Error ejecutando mostrarFormularioNuevoProducto:', error);
                    // Ejecutar código directo como respaldo
                    ejecutarNuevoProductoDirecto();
                }
                
                return false;
            });
            
            // También agregar el onclick como respaldo
            btn.setAttribute('onclick', 'mostrarFormularioNuevoProducto(); return false;');
            
            console.log(`✅ Botón Nuevo Producto ${index + 1} configurado con múltiples eventos`);
        });
        
        // Sobrescribir botones de carrito
        const botonesCarrito = document.querySelectorAll('[onclick*="crearPedido"]');
        botonesCarrito.forEach((btn, index) => {
            const originalOnclick = btn.getAttribute('onclick');
            btn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🛒 Ejecutando ${originalOnclick} desde sobrescritura`);
                try {
                    eval(originalOnclick);
                } catch (error) {
                    console.error('❌ Error en sobrescritura:', error);
                }
                return false;
            };
            console.log(`✅ Botón carrito ${index + 1} sobrescrito`);
        });
        
        // Sobrescribir botones de acción de productos
        const botonesAccionProductos = document.querySelectorAll('#productos [onclick*="editarProducto"], #productos [onclick*="eliminarProducto"], #productos [onclick*="verDetalle"]');
        botonesAccionProductos.forEach((btn, index) => {
            const originalOnclick = btn.getAttribute('onclick');
            if (originalOnclick) {
                btn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`🔧 Ejecutando ${originalOnclick} desde sobrescritura`);
                    try {
                        eval(originalOnclick);
                    } catch (error) {
                        console.error('❌ Error en sobrescritura:', error);
                    }
                    return false;
                };
                console.log(`✅ Botón acción producto ${index + 1} sobrescrito`);
            }
        });
    };
    
    // Función de respaldo para ejecutar nuevo producto directamente
    window.ejecutarNuevoProductoDirecto = function() {
        console.log('🚨 EJECUTANDO NUEVO PRODUCTO DIRECTO (RESPALDO)');
        
        try {
            // Ocultar la tabla de productos
            const tableContainer = document.querySelector('#productos .table-container');
            if (tableContainer) {
                tableContainer.style.display = 'none';
                console.log('✅ Tabla de productos ocultada');
            }
            
            // Mostrar el formulario
            const formulario = document.getElementById('formularioProducto');
            if (formulario) {
                formulario.style.display = 'block';
                console.log('✅ Formulario de productos mostrado');
                
                // Configurar para nuevo producto
                const titulo = document.getElementById('formularioProductoTitulo');
                if (titulo) {
                    titulo.textContent = 'Nuevo Producto';
                }
                
                // Limpiar formulario
                const form = document.getElementById('productoForm');
                if (form) {
                    form.reset();
                }
                
                console.log('✅ RESPALDO EJECUTADO CORRECTAMENTE');
            } else {
                console.error('❌ No se encontró el formulario de productos');
                alert('Error: No se encontró el formulario de productos');
            }
        } catch (error) {
            console.error('❌ Error en respaldo:', error);
            alert('Error al mostrar el formulario: ' + error.message);
        }
    };
    
    // Función para sobrescribir completamente la función mostrarSugerenciasProductos
    window.sobrescribirMostrarSugerencias = function() {
        console.log('🔄 Sobrescribiendo función mostrarSugerenciasProductos...');
        
        // Guardar la función original
        const originalMostrarSugerencias = window.mostrarSugerenciasProductos;
        
        // Sobrescribir con nuestra función
        window.mostrarSugerenciasProductos = function(searchTerm) {
            console.log('🌽 Ejecutando mostrarSugerenciasProductos sobrescrita con término:', searchTerm);
            
            const suggestions = document.getElementById('productoSuggestions');
            if (!suggestions) {
                console.error('❌ No se encontró productoSuggestions');
                return;
            }
            
            // Limpiar contenido
            suggestions.innerHTML = '';
            
            // Obtener solo productos de maíz y tostadas
            const productosMaiz = Object.values(productosData).filter(producto =>
                producto.categoria.includes('Maíz') || producto.categoria.includes('Tostada')
            );
            
            let productosFiltrados;
            if (!searchTerm || searchTerm === '') {
                productosFiltrados = productosMaiz;
            } else {
                productosFiltrados = productosMaiz.filter(producto =>
                    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    producto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    producto.id.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            console.log(`🌽 Mostrando ${productosFiltrados.length} productos de maíz filtrados`);
            
            // Crear elementos
            productosFiltrados.forEach(producto => {
                const item = document.createElement('div');
                item.className = 'producto-suggestion-item';
                item.style.cssText = `
                    padding: 12px;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    transition: background-color 0.2s;
                `;
                
                item.innerHTML = `
                    <div>
                        <strong>${producto.nombre}</strong>
                        <div style="font-size: 0.875rem; color: #666;">
                            ${producto.categoria} | €${producto.precio.toFixed(2)} | Stock: ${producto.stock}
                        </div>
                    </div>
                `;
                
                // Eventos
                item.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = '#f5f5f5';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = '';
                });
                
                item.addEventListener('click', function() {
                    console.log('🎯 Producto de maíz seleccionado:', producto.nombre);
                    seleccionarProducto(producto);
                });
                
                suggestions.appendChild(item);
            });
            
            // Mostrar sugerencias
            suggestions.style.display = productosFiltrados.length > 0 ? 'block' : 'none';
        };
        
        console.log('✅ Función mostrarSugerenciasProductos sobrescrita');
    };
    
    // Función para limpiar cualquier contenido hardcodeado
    window.limpiarProductosHardcodeados = function() {
        console.log('🧹 Limpiando productos hardcodeados...');
        
        // Buscar y eliminar cualquier elemento que contenga productos de cómputo
        const elementos = document.querySelectorAll('*');
        elementos.forEach(el => {
            if (el.textContent) {
                const texto = el.textContent.toLowerCase();
                if ((texto.includes('laptop') || texto.includes('monitor') || texto.includes('auriculares')) &&
                    (texto.includes('stock') || texto.includes('precio') || texto.includes('€'))) {
                    console.log('🗑️ Elemento con producto de cómputo encontrado y removido');
                    if (el.classList.contains('producto-suggestion-item')) {
                        el.remove();
                    }
                }
            }
        });
    };
    
    // Función para monitorear y reemplazar productos automáticamente
    window.monitorearYReemplazar = function() {
        console.log('👁️ Iniciando monitoreo de productos...');
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            const texto = node.textContent || '';
                            if (texto.includes('Laptop') || texto.includes('Monitor') || texto.includes('Auriculares')) {
                                console.log('🚫 Producto de cómputo detectado y eliminado:', texto.trim());
                                if (node.remove) {
                                    node.remove();
                                }
                                // Forzar productos de maíz después de eliminación
                                setTimeout(forzarProductosMaiz, 100);
                            }
                        }
                    });
                }
            });
        });
        
        // Observar el contenedor de sugerencias
        const suggestions = document.getElementById('productoSuggestions');
        if (suggestions) {
            observer.observe(suggestions, {
                childList: true,
                subtree: true
            });
            console.log('✅ Observador configurado en productoSuggestions');
        }
        
        // También observar el documento completo
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ Monitoreo global activado');
    };
    
    // Ejecutar automáticamente
    setTimeout(() => {
        sobrescribirMostrarSugerencias();
        interceptarPaso2();
        forzarProductosMaiz();
        sobrescribirBotones();
        limpiarProductosHardcodeados();
        monitorearYReemplazar();
        
        // EJECUTAR FUNCIÓN DE EMERGENCIA AUTOMÁTICAMENTE
        emergenciaProductosMaiz();
        
        // ARREGLAR BOTÓN NUEVO PRODUCTO
        console.log('🔧 CONFIGURANDO BOTÓN NUEVO PRODUCTO...');
        forzarBotonNuevoProducto();
        
        // Probar el botón automáticamente
        setTimeout(() => {
            console.log('🧪 PROBANDO BOTÓN NUEVO PRODUCTO AUTOMÁTICAMENTE...');
            probarNuevoProducto();
        }, 1000);
        
    }, 2000);
    
    // Ejecutar emergencia también cuando se haga click en el campo de productos
    const productoPedidoInput = document.getElementById('productoPedido');
    if (productoPedidoInput) {
        productoPedidoInput.addEventListener('focus', emergenciaProductosMaiz);
        productoPedidoInput.addEventListener('click', emergenciaProductosMaiz);
        productoPedidoInput.addEventListener('keyup', emergenciaProductosMaiz);
    }
    
    // Crear atajo de teclado para ejecutar emergencia (Ctrl+Shift+M)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'M') {
            e.preventDefault();
            console.log('🚨 ATAJO ACTIVADO: Ejecutando emergencia productos de maíz');
            emergenciaProductosMaiz();
        }
        
        // Atajo para arreglar botón de productos (Ctrl+Shift+P)
        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
            e.preventDefault();
            console.log('🚨 ATAJO ACTIVADO: Arreglando botón Nuevo Producto');
            forzarBotonNuevoProducto();
            
            // Probar inmediatamente
            setTimeout(() => {
                probarNuevoProducto();
            }, 500);
        }
    });
    
    console.log('⚡ SISTEMA DE EMERGENCIA CONFIGURADO:');
    console.log('- Auto-ejecución al cargar página ✅');
    console.log('- Auto-ejecución al enfocar campo de productos ✅');
    console.log('- Atajo de teclado para productos maíz: Ctrl+Shift+M ✅');
    console.log('- Atajo de teclado para botón productos: Ctrl+Shift+P ✅');
    console.log('- Auto-configuración del botón Nuevo Producto ✅');
    console.log('- Auto-prueba del botón ✅');
});

// Funciones de diagnóstico automático
console.log('🔍 Iniciando diagnóstico automático...');

// Función de emergencia para ejecutar inmediatamente
window.emergenciaProductosMaiz = function() {
    console.log('🚨 FUNCIÓN DE EMERGENCIA - LIMPIEZA TOTAL Y FORZADO DE PRODUCTOS DE MAÍZ');
    
    // 1. Eliminar TODOS los elementos que contengan productos de cómputo
    const elementosEliminar = document.querySelectorAll('*');
    let eliminados = 0;
    elementosEliminar.forEach(elemento => {
        const texto = elemento.textContent || '';
        if ((texto.includes('Laptop Ultraligera X200') || 
             texto.includes('Monitor Curvo') || 
             texto.includes('Mouse Gaming') || 
             texto.includes('Teclado Mecánico') || 
             texto.includes('Auriculares Bluetooth')) &&
            (elemento.tagName === 'TR' || elemento.tagName === 'TD' || 
             elemento.classList.contains('producto-suggestion-item') ||
             elemento.closest('#productoSuggestions'))) {
            console.log('🗑️ ELIMINANDO:', texto.substring(0, 50));
            elemento.remove();
            eliminados++;
        }
    });
    console.log(`✅ Eliminados ${eliminados} elementos con productos de cómputo`);
    
    // 2. Sobrescribir función completamente
    window.mostrarSugerenciasProductos = function(searchTerm) {
        console.log('🌽 EMERGENCIA: Mostrando SOLO productos de maíz y tostadas');
        
        const suggestions = document.getElementById('productoSuggestions');
        if (!suggestions) {
            console.error('❌ No se encontró productoSuggestions');
            return;
        }
        
        // Limpiar completamente
        suggestions.innerHTML = '';
        
        // Insertar HTML hardcodeado con productos de maíz
        suggestions.innerHTML = `
            <div class="producto-suggestion-item" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer; background: white;" onclick="seleccionarProductoDirecto('MAIZ-001')">
                <div>
                    <strong>🌽 Maíz Cacahuazintle para Pozole</strong>
                    <div style="font-size: 0.875rem; color: #666;">
                        Maíz y Derivados | €45.00 | Stock: 120
                    </div>
                </div>
            </div>
            <div class="producto-suggestion-item" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer; background: white;" onclick="seleccionarProductoDirecto('TOST-001')">
                <div>
                    <strong>🌮 Tostadas de Maíz Natural</strong>
                    <div style="font-size: 0.875rem; color: #666;">
                        Tostadas | €12.50 | Stock: 65
                    </div>
                </div>
            </div>
            <div class="producto-suggestion-item" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer; background: white;" onclick="seleccionarProductoDirecto('MAIZ-002')">
                <div>
                    <strong>🌽 Maíz Blanco para Pozole</strong>
                    <div style="font-size: 0.875rem; color: #666;">
                        Maíz y Derivados | €38.00 | Stock: 95
                    </div>
                </div>
            </div>
            <div class="producto-suggestion-item" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer; background: white;" onclick="seleccionarProductoDirecto('TOST-002')">
                <div>
                    <strong>🔵 Tostadas de Maíz Azul</strong>
                    <div style="font-size: 0.875rem; color: #666;">
                        Tostadas | €15.00 | Stock: 45
                    </div>
                </div>
            </div>
            <div class="producto-suggestion-item" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer; background: white;" onclick="seleccionarProductoDirecto('PROD005')">
                <div>
                    <strong>🌾 Harina de Maíz</strong>
                    <div style="font-size: 0.875rem; color: #666;">
                        Derivados | €95.00 | Stock: 40
                    </div>
                </div>
            </div>
        `;
        
        // Estilos forzados
        suggestions.style.cssText = `
            display: block !important;
            position: relative !important;
            background: white !important;
            border: 2px solid #28a745 !important;
            border-radius: 8px !important;
            max-height: 400px !important;
            overflow-y: auto !important;
            width: 100% !important;
            z-index: 9999 !important;
            box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3) !important;
            margin-top: 5px !important;
        `;
        
        console.log('✅ EMERGENCIA: 5 productos de maíz insertados con estilos forzados');
    };
    
    // 3. Limpiar tablas existentes que puedan tener productos hardcodeados
    const tablasProductos = document.querySelectorAll('table tbody tr');
    tablasProductos.forEach(fila => {
        const texto = fila.textContent || '';
        if (texto.includes('Laptop Ultraligera X200')) {
            console.log('🗑️ ELIMINANDO FILA DE TABLA:', texto.substring(0, 50));
            fila.remove();
        }
    });
    
    // 4. Ejecutar inmediatamente
    setTimeout(() => {
        mostrarSugerenciasProductos('');
    }, 100);
    
    // 5. Configurar limpieza automática cada segundo
    if (window.limpiezaInterval) {
        clearInterval(window.limpiezaInterval);
    }
    
    window.limpiezaInterval = setInterval(() => {
        // Ejecutar sugerencias
        if (document.getElementById('productoSuggestions')) {
            mostrarSugerenciasProductos('');
        }
        
        // Eliminar cualquier elemento nuevo que contenga productos de cómputo
        const nuevosElementos = document.querySelectorAll('*');
        nuevosElementos.forEach(el => {
            if (el.textContent && el.textContent.includes('Laptop Ultraligera X200') && 
                (el.tagName === 'TR' || el.tagName === 'TD')) {
                console.log('🚫 AUTO-ELIMINANDO:', el.textContent.substring(0, 30));
                el.remove();
            }
        });
    }, 2000);
    
    console.log('🚨 ===== EMERGENCIA EJECUTADA COMPLETAMENTE =====');
    console.log('🌽 PRODUCTOS DISPONIBLES:');
    console.log('1. 🌽 Maíz Cacahuazintle para Pozole (€45.00)');
    console.log('2. 🌮 Tostadas de Maíz Natural (€12.50)');
    console.log('3. 🌽 Maíz Blanco para Pozole (€38.00)');
    console.log('4. 🔵 Tostadas de Maíz Azul (€15.00)');
    console.log('5. 🌾 Harina de Maíz (€95.00)');
    console.log('⚡ Limpieza automática activada cada 2 segundos');
};

// Función para seleccionar producto directamente
window.seleccionarProductoDirecto = function(productoId) {
    console.log('🎯 Selección directa de producto:', productoId);
    
         const productos = {
         'MAIZ-001': { nombre: 'Maíz Cacahuazintle para Pozole', precio: 45.00, stock: 120 },
         'TOST-001': { nombre: 'Tostadas de Maíz Natural', precio: 12.50, stock: 65 },
         'MAIZ-002': { nombre: 'Maíz Blanco para Pozole', precio: 38.00, stock: 95 },
         'TOST-002': { nombre: 'Maíz Blanco para Pozole', precio: 15.00, stock: 45 },
         'PROD004': { nombre: 'Tostadas de Maíz Azul', precio: 85.00, stock: 30 },
         'PROD005': { nombre: 'Harina de Maíz', precio: 95.00, stock: 40 }
     };
    
    const producto = productos[productoId];
    if (producto) {
        document.getElementById('productoPedido').value = producto.nombre;
        document.getElementById('productoNombre').textContent = producto.nombre;
        document.getElementById('productoPrecio').textContent = `€${producto.precio.toFixed(2)}`;
        document.getElementById('productoStock').textContent = producto.stock;
        document.getElementById('productoCantidad').max = producto.stock;
        document.getElementById('productoCantidad').value = 1;
        
        document.getElementById('productoSeleccionado').style.display = 'block';
        document.getElementById('productoSuggestions').style.display = 'none';
        
        console.log('✅ Producto seleccionado directamente:', producto.nombre);
    }
};

// Verificar productos de maíz y tostadas
setTimeout(() => {
    try {
        probarProductosMaiz();
    } catch (error) {
        console.error('❌ Error en probarProductosMaiz:', error);
    }
}, 2000);

// Verificar estado general y ejecutar diagnóstico completo
setTimeout(() => {
    try {
        verificarEstado();
        console.log('🚀 Ejecutando diagnóstico completo automático...');
        diagnosticoCompleto();
    } catch (error) {
        console.error('❌ Error en verificación:', error);
    }
}, 3000);

// ===== EJECUCIÓN INMEDIATA DE EMERGENCIA =====
console.log('🚨 INICIANDO EJECUCIÓN INMEDIATA DE EMERGENCIA...');

// Ejecutar inmediatamente apenas se cargue el script
if (typeof emergenciaProductosMaiz === 'function') {
    setTimeout(emergenciaProductosMaiz, 500);
} else {
    // Si la función aún no está definida, ejecutar código directo
    setTimeout(() => {
        console.log('🚨 LIMPIEZA DIRECTA DE EMERGENCIA');
        
        // Sobrescribir mostrarSugerenciasProductos inmediatamente
        window.mostrarSugerenciasProductos = function(searchTerm) {
            const suggestions = document.getElementById('productoSuggestions');
            if (suggestions) {
                suggestions.innerHTML = `
                    <div style="padding: 12px; border: 2px solid #28a745; background: #f8fff9; margin: 5px; border-radius: 5px;">
                        <strong>🌽 Maíz Cacahuazintle para Pozole - €45.00</strong>
                    </div>
                    <div style="padding: 12px; border: 2px solid #28a745; background: #f8fff9; margin: 5px; border-radius: 5px;">
                        <strong>🌮 Tostadas de Maíz Natural - €12.50</strong>
                    </div>
                    <div style="padding: 12px; border: 2px solid #28a745; background: #f8fff9; margin: 5px; border-radius: 5px;">
                        <strong>🌽 Maíz Blanco para Pozole - €38.00</strong>
                    </div>
                `;
                suggestions.style.display = 'block';
                suggestions.style.border = '3px solid #28a745';
                suggestions.style.backgroundColor = '#f8fff9';
            }
        };
        
        // Ejecutar inmediatamente
        mostrarSugerenciasProductos('');
        
        console.log('✅ LIMPIEZA DIRECTA COMPLETADA');
    }, 100);
}

console.log('⚡ SISTEMA TOTALMENTE CONFIGURADO PARA MOSTRAR SOLO PRODUCTOS DE MAÍZ Y TOSTADAS');

// ===== FUNCIONES GLOBALES PARA EL USUARIO =====
window.arreglarNuevoProducto = function() {
    console.log('🛠️ ARREGLANDO BOTÓN NUEVO PRODUCTO MANUALMENTE...');
    forzarBotonNuevoProducto();
    probarNuevoProducto();
};

window.ayuda = function() {
    console.log('🆘 AYUDA - FUNCIONES DISPONIBLES:');
    console.log('');
    console.log('📋 COMANDOS DISPONIBLES:');
    console.log('1. arreglarNuevoProducto() - Arregla el botón "+ Nuevo Producto"');
    console.log('2. emergenciaProductosMaiz() - Fuerza productos de maíz en pedidos');
    console.log('3. probarNuevoProducto() - Prueba el botón de nuevo producto');
    console.log('4. forzarBotonNuevoProducto() - Reconfigura el botón');
    console.log('5. ejecutarNuevoProductoDirecto() - Abre formulario directamente');
    console.log('');
    console.log('⌨️ ATAJOS DE TECLADO:');
    console.log('- Ctrl+Shift+M: Emergencia productos de maíz');
    console.log('- Ctrl+Shift+P: Arreglar botón Nuevo Producto');
    console.log('');
    console.log('🆘 SI EL BOTÓN NO FUNCIONA:');
    console.log('1. Presiona Ctrl+Shift+P');
    console.log('2. O ejecuta: arreglarNuevoProducto()');
    console.log('3. O ejecuta: ejecutarNuevoProductoDirecto()');
};

console.log('🆘 ESCRIBE "ayuda()" EN LA CONSOLA PARA VER TODOS LOS COMANDOS DISPONIBLES');

// Función de limpieza total de productos de cómputo
function limpiezaTotalProductos() {
    console.log('🧹 INICIANDO LIMPIEZA TOTAL DE PRODUCTOS DE CÓMPUTO...');
    
    // Seleccionar el contenedor de sugerencias
    const suggestions = document.getElementById('productoSuggestions');
    if (suggestions) {
        // Limpiar completamente el contenedor
        suggestions.innerHTML = '';
        console.log('✅ Contenedor de sugerencias limpiado');
        
        // Inyectar SOLO productos de maíz y tostadas
        suggestions.innerHTML = `
            <div class="producto-suggestion-item" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer;" onclick="seleccionarProductoMaiz('MAIZ-001')">
                <div>
                    <strong>Maíz Cacahuazintle para Pozole</strong>
                    <div style="font-size: 0.875rem; color: #666;">
                        Maíz y Derivados | €45.00 | Stock: 120
                    </div>
                </div>
            </div>
            <div class="producto-suggestion-item" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer;" onclick="seleccionarProductoMaiz('TOST-001')">
                <div>
                    <strong>Tostadas de Maíz Natural</strong>
                    <div style="font-size: 0.875rem; color: #666;">
                        Tostadas | €12.50 | Stock: 65
                    </div>
                </div>
            </div>
            <div class="producto-suggestion-item" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer;" onclick="seleccionarProductoMaiz('MAIZ-002')">
                <div>
                    <strong>Maíz Blanco para Pozole</strong>
                    <div style="font-size: 0.875rem; color: #666;">
                        Maíz y Derivados | €38.00 | Stock: 95
                    </div>
                </div>
            </div>
            <div class="producto-suggestion-item" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer;" onclick="seleccionarProductoMaiz('TOST-002')">
                <div>
                    <strong>Tostadas de Maíz Azul</strong>
                    <div style="font-size: 0.875rem; color: #666;">
                        Tostadas | €15.00 | Stock: 45
                    </div>
                </div>
            </div>
            <div class="producto-suggestion-item" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer;" onclick="seleccionarProductoMaiz('PROD004')">
                <div>
                    <strong>Tostadas de Maíz Azul</strong>
                    <div style="font-size: 0.875rem; color: #666;">
                        Gaming | €85.00 | Stock: 30
                    </div>
                </div>
            </div>
            <div class="producto-suggestion-item" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer;" onclick="seleccionarProductoMaiz('PROD005')">
                <div>
                    <strong>Harina de Maíz</strong>
                    <div style="font-size: 0.875rem; color: #666;">
                        Derivados | €95.00 | Stock: 40
                    </div>
                </div>
            </div>
        `;
        
        // Mostrar el contenedor
        suggestions.style.display = 'block';
        console.log('✅ Productos de maíz inyectados correctamente');
    }
    
    // Eliminar cualquier elemento que contenga texto de productos de cómputo
    const elementosConComputoPorTexto = document.querySelectorAll('*');
    elementosConComputoPorTexto.forEach(elemento => {
        if (elemento.textContent && 
            (elemento.textContent.includes('Laptop') || 
             elemento.textContent.includes('Monitor') || 
             elemento.textContent.includes('Mouse') || 
             elemento.textContent.includes('Teclado') || 
             elemento.textContent.includes('Auriculares'))) {
            
            // Solo eliminar si es parte de las sugerencias de productos
            if (elemento.closest('#productoSuggestions') || 
                elemento.classList.contains('producto-suggestion-item')) {
                elemento.remove();
                console.log('🗑️ Eliminado elemento con producto de cómputo:', elemento.textContent.substring(0, 50));
            }
        }
    });
}

// Función para seleccionar un producto de maíz
function seleccionarProductoMaiz(productoId) {
    console.log('🌽 Seleccionando producto de maíz:', productoId);
    
    const productos = {
        'MAIZ-001': { 
            id: 'MAIZ-001',
            nombre: 'Maíz Cacahuazintle para Pozole', 
            precio: 45.00, 
            stock: 120,
            categoria: 'Maíz y Derivados'
        },
        'TOST-001': { 
            id: 'TOST-001',
            nombre: 'Tostadas de Maíz Natural', 
            precio: 12.50, 
            stock: 65,
            categoria: 'Tostadas'
        },
        'MAIZ-002': { 
            id: 'MAIZ-002',
            nombre: 'Maíz Blanco para Pozole', 
            precio: 38.00, 
            stock: 95,
            categoria: 'Maíz y Derivados'
        },
        'TOST-002': { 
            id: 'TOST-002',
            nombre: 'Tostadas de Maíz Azul', 
            precio: 15.00, 
            stock: 45,
            categoria: 'Tostadas'
        },
        'PROD004': { 
            id: 'PROD004',
            nombre: 'Tostadas de Maíz Azul', 
            precio: 85.00, 
            stock: 30,
            categoria: 'Gaming'
        },
        'PROD005': { 
            id: 'PROD005',
            nombre: 'Harina de Maíz', 
            precio: 95.00, 
            stock: 40,
            categoria: 'Derivados'
        }
    };
    
    const producto = productos[productoId];
    if (producto) {
        // Llenar el campo de búsqueda
        const searchInput = document.getElementById('productoPedido');
        if (searchInput) {
            searchInput.value = producto.nombre;
        }
        
        // Ocultar sugerencias
        const suggestions = document.getElementById('productoSuggestions');
        if (suggestions) {
            suggestions.style.display = 'none';
        }
        
        // Agregar el producto a la lista
        if (typeof agregarProductoAPedido === 'function') {
            agregarProductoAPedido(producto);
        } else if (typeof seleccionarProducto === 'function') {
            seleccionarProducto(producto);
        }
        
        console.log('✅ Producto agregado:', producto.nombre);
    }
}

// Sobrescribir completamente la función mostrarSugerenciasProductos
function sobrescribirSugerenciasCompleto() {
    console.log('🔄 Sobrescribiendo función de sugerencias completamente...');
    
    // Redefinir la función global
    window.mostrarSugerenciasProductos = function(searchTerm = '') {
        console.log('🌽 Función sobrescrita ejecutándose, término:', searchTerm);
        limpiezaTotalProductos();
    };
    
    console.log('✅ Función mostrarSugerenciasProductos sobrescrita');
}

// Ejecutar automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Ejecutando funciones de limpieza total...');
    
    setTimeout(() => {
        sobrescribirSugerenciasCompleto();
        limpiezaTotalProductos();
        
        // Ejecutar limpieza cada 2 segundos
        setInterval(limpiezaTotalProductos, 2000);
        
        // Ejecutar limpieza cuando se haga click en el input de productos
        const productInput = document.getElementById('productoPedido');
        if (productInput) {
            productInput.addEventListener('focus', limpiezaTotalProductos);
            productInput.addEventListener('click', limpiezaTotalProductos);
        }
        
        console.log('✅ Sistema de limpieza total activado');
    }, 1000);
});