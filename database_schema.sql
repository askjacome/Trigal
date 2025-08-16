-- Script de creación de base de datos para CRM Trigal
-- Ejecutar en MySQL después de crear la base de datos

USE trigal_crm;

-- Tabla de Usuarios y Seguridad
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rol ENUM('admin', 'vendedor', 'supervisor', 'cliente') NOT NULL DEFAULT 'vendedor',
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_rol (rol)
);

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id VARCHAR(10) PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    razon_social VARCHAR(200),
    rfc VARCHAR(20) UNIQUE,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    vendedor_id INT,
    condiciones_pago VARCHAR(50) DEFAULT 'Contado',
    estado ENUM('Activo', 'Inactivo', 'Suspendido') DEFAULT 'Activo',
    region VARCHAR(50),
    limite_credito DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
    INDEX idx_vendedor (vendedor_id),
    INDEX idx_estado (estado),
    INDEX idx_region (region)
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS productos (
    id VARCHAR(10) PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    categoria VARCHAR(100),
    marca VARCHAR(100),
    precio DECIMAL(10,2) NOT NULL,
    precio_original DECIMAL(10,2),
    stock INT DEFAULT 0,
    stock_minimo INT DEFAULT 10,
    descripcion TEXT,
    especificaciones JSON,
    imagenes JSON,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_sku (sku),
    INDEX idx_categoria (categoria),
    INDEX idx_activo (activo),
    INDEX idx_stock (stock)
);

-- Tabla de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id VARCHAR(10) PRIMARY KEY,
    cliente_id VARCHAR(10) NOT NULL,
    vendedor_id INT NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega DATE,
    estado ENUM('Pendiente', 'Procesando', 'Entregado', 'Cancelado') DEFAULT 'Pendiente',
    subtotal DECIMAL(10,2) NOT NULL,
    impuestos DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    observaciones TEXT,
    direccion_entrega TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_vendedor (vendedor_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_pedido)
);

-- Tabla de Detalle de Pedidos
CREATE TABLE IF NOT EXISTS pedido_detalles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id VARCHAR(10) NOT NULL,
    producto_id VARCHAR(10) NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    INDEX idx_pedido (pedido_id),
    INDEX idx_producto (producto_id)
);

-- Tabla de Rutas de Ventas
CREATE TABLE IF NOT EXISTS rutas_ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vendedor_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    fecha_ruta DATE NOT NULL,
    estado ENUM('Planificada', 'En_Progreso', 'Completada', 'Cancelada') DEFAULT 'Planificada',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
    INDEX idx_vendedor (vendedor_id),
    INDEX idx_fecha (fecha_ruta),
    INDEX idx_estado (estado)
);

-- Tabla de Clientes en Ruta
CREATE TABLE IF NOT EXISTS ruta_clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ruta_id INT NOT NULL,
    cliente_id VARCHAR(10) NOT NULL,
    orden_visita INT,
    hora_estimada TIME,
    hora_visita TIMESTAMP NULL,
    estado_visita ENUM('Pendiente', 'Visitado', 'No_Visitado') DEFAULT 'Pendiente',
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    observaciones TEXT,
    
    FOREIGN KEY (ruta_id) REFERENCES rutas_ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    INDEX idx_ruta (ruta_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_estado (estado_visita)
);

-- Tabla de Sesiones de Usuario (opcional, para seguridad avanzada)
CREATE TABLE IF NOT EXISTS sesiones_usuario (
    id VARCHAR(128) PRIMARY KEY,
    usuario_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activa BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_activa (activa)
);

-- Insertar datos de ejemplo

-- Usuario administrador por defecto
INSERT INTO usuarios (username, email, password_hash, nombre, apellido, rol) 
VALUES ('admin', 'admin@trigal.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/BqsZE1aLS', 'Administrador', 'Sistema', 'admin')
ON DUPLICATE KEY UPDATE username = username;

-- Productos de maíz especializados
INSERT INTO productos (id, sku, nombre, categoria, marca, precio, precio_original, stock, descripcion) VALUES
('PROD001', 'MAIZ001', 'Maíz Cacahuazintle para Pozole', 'Granos', 'Trigal', 45.00, 45.00, 100, 'Maíz cacahuazintle premium, ideal para pozole tradicional. Grano grande y blanco.'),
('PROD002', 'TOST001', 'Tostadas de Maíz Natural', 'Derivados', 'Trigal', 12.50, 12.50, 200, 'Tostadas crujientes de maíz natural, sin conservadores artificiales.'),
('PROD003', 'MAIZ002', 'Maíz Blanco para Pozole', 'Granos', 'Trigal', 38.00, 38.00, 150, 'Maíz blanco especial para pozole, cocción rápida y sabor tradicional.'),
('PROD004', 'TOST002', 'Tostadas de Maíz Azul', 'Derivados', 'Trigal', 15.00, 15.00, 80, 'Tostadas de maíz azul, ricas en antioxidantes y sabor único.'),
('PROD005', 'HARIN001', 'Harina de Maíz', 'Harinas', 'Trigal', 95.00, 95.00, 50, 'Harina de maíz premium para tortillas, tamales y repostería mexicana.')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Cliente de ejemplo
INSERT INTO clientes (id, nombre, razon_social, rfc, direccion, telefono, email, vendedor_id, region) 
VALUES ('C001', 'Distribuidora El Sol S.A.', 'Distribuidora El Sol, S.A. de C.V.', 'ABC123456XYZ', 'Av. Insurgentes Sur 1234, Col. Del Valle, CDMX', '+52 55 1234 5678', 'contacto@elsol.com', 1, 'Centro')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Verificar datos insertados
SELECT 'Usuarios creados:' as tabla, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'Productos creados:', COUNT(*) FROM productos
UNION ALL
SELECT 'Clientes creados:', COUNT(*) FROM clientes;

-- Mostrar estructura de tablas
SHOW TABLES;

DESCRIBE usuarios;
DESCRIBE clientes;
DESCRIBE productos;
