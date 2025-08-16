-- ===== TRIGAL CRM v1.2.0 - ESQUEMA DE PRODUCCIÓN =====
-- Base de datos SQL Server para Azure
-- Fecha: 16 de Agosto de 2025
-- Versión: 1.2.0 Production

-- Configuración inicial
USE master;
GO

-- Crear base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'TrigalCRM_Production')
BEGIN
    CREATE DATABASE TrigalCRM_Production;
END
GO

USE TrigalCRM_Production;
GO

-- ===== TABLA DE CONFIGURACIÓN DEL SISTEMA =====
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='sistema_config' AND xtype='U')
BEGIN
    CREATE TABLE sistema_config (
        id INT PRIMARY KEY IDENTITY(1,1),
        clave NVARCHAR(100) UNIQUE NOT NULL,
        valor NVARCHAR(MAX),
        descripcion NVARCHAR(255),
        tipo NVARCHAR(50) DEFAULT 'string',
        activo BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- ===== TABLA DE USUARIOS Y SEGURIDAD (ACTUALIZADA) =====
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='usuarios' AND xtype='U')
BEGIN
    CREATE TABLE usuarios (
        id INT PRIMARY KEY IDENTITY(1,1),
        username NVARCHAR(50) UNIQUE NOT NULL,
        email NVARCHAR(100) UNIQUE NOT NULL,
        password_hash NVARCHAR(255) NOT NULL,
        nombre NVARCHAR(100) NOT NULL,
        apellido NVARCHAR(100) NOT NULL,
        rol NVARCHAR(50) NOT NULL, -- admin, gerente_ventas, vendedor, gerente_finanzas
        telefono NVARCHAR(20),
        zona NVARCHAR(100),
        activo BIT DEFAULT 1,
        ultimo_acceso DATETIME,
        intentos_login INT DEFAULT 0,
        bloqueado_hasta DATETIME NULL,
        token_reset NVARCHAR(255) NULL,
        token_reset_expira DATETIME NULL,
        avatar_url NVARCHAR(500),
        preferencias NVARCHAR(MAX), -- JSON con configuraciones personales
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- ===== TABLA DE CLIENTES (ACTUALIZADA) =====
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='clientes' AND xtype='U')
BEGIN
    CREATE TABLE clientes (
        id INT PRIMARY KEY IDENTITY(1,1),
        codigo_cliente NVARCHAR(20) UNIQUE, -- Código único generado
        nombre NVARCHAR(150) NOT NULL,
        contacto NVARCHAR(100) NOT NULL,
        email NVARCHAR(100),
        telefono NVARCHAR(20) NOT NULL,
        telefono_secundario NVARCHAR(20),
        direccion NVARCHAR(255) NOT NULL,
        ciudad NVARCHAR(100) NOT NULL,
        estado NVARCHAR(100) NOT NULL,
        codigo_postal NVARCHAR(10),
        pais NVARCHAR(50) DEFAULT 'México',
        latitud DECIMAL(10, 8),
        longitud DECIMAL(11, 8),
        vendedor_id INT,
        activo BIT DEFAULT 1,
        tipo NVARCHAR(50) DEFAULT 'regular', -- regular, mayorista, distribuidor, vip
        limite_credito DECIMAL(15,2) DEFAULT 0,
        dias_credito INT DEFAULT 0,
        descuento_especial DECIMAL(5,2) DEFAULT 0, -- Porcentaje de descuento
        rfc NVARCHAR(20),
        razon_social NVARCHAR(200),
        giro_comercial NVARCHAR(100),
        sitio_web NVARCHAR(200),
        notas NVARCHAR(MAX),
        fecha_registro DATETIME DEFAULT GETDATE(),
        ultima_compra DATETIME,
        total_compras DECIMAL(15,2) DEFAULT 0,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (vendedor_id) REFERENCES usuarios(id)
    );
END
GO

-- ===== TABLA DE PRODUCTOS (ACTUALIZADA) =====
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='productos' AND xtype='U')
BEGIN
    CREATE TABLE productos (
        id INT PRIMARY KEY IDENTITY(1,1),
        codigo NVARCHAR(50) UNIQUE NOT NULL,
        nombre NVARCHAR(150) NOT NULL,
        descripcion NVARCHAR(MAX),
        categoria NVARCHAR(100) NOT NULL,
        subcategoria NVARCHAR(100),
        unidad NVARCHAR(20) NOT NULL, -- kg, ton, saco, caja, pza
        precio_base DECIMAL(15,4) NOT NULL,
        iva DECIMAL(5,2) NOT NULL DEFAULT 16,
        precio_venta DECIMAL(15,4) NOT NULL,
        precio_mayorista DECIMAL(15,4),
        precio_distribuidor DECIMAL(15,4),
        costo DECIMAL(15,4),
        margen_utilidad DECIMAL(5,2),
        stock DECIMAL(15,3) DEFAULT 0,
        stock_minimo DECIMAL(15,3) DEFAULT 0,
        stock_maximo DECIMAL(15,3),
        ubicacion_almacen NVARCHAR(100),
        proveedor NVARCHAR(150),
        tiempo_entrega_dias INT DEFAULT 0,
        peso_unitario DECIMAL(10,3), -- en kg
        dimensiones NVARCHAR(100), -- LxWxH en cm
        codigo_barras NVARCHAR(50),
        imagen_url NVARCHAR(500),
        activo BIT DEFAULT 1,
        destacado BIT DEFAULT 0,
        estacional BIT DEFAULT 0,
        requiere_refrigeracion BIT DEFAULT 0,
        vida_util_dias INT,
        certificaciones NVARCHAR(MAX), -- JSON array
        tags NVARCHAR(MAX), -- JSON array para búsquedas
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- ===== TABLA DE PEDIDOS (ACTUALIZADA) =====
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pedidos' AND xtype='U')
BEGIN
    CREATE TABLE pedidos (
        id INT PRIMARY KEY IDENTITY(1,1),
        numero NVARCHAR(50) UNIQUE NOT NULL,
        cliente_id INT NOT NULL,
        vendedor_id INT NOT NULL,
        fecha DATETIME DEFAULT GETDATE(),
        fecha_entrega_estimada DATETIME,
        fecha_entrega_real DATETIME,
        estado NVARCHAR(50) DEFAULT 'pendiente', -- pendiente, confirmado, procesando, enviado, entregado, cancelado
        prioridad NVARCHAR(20) DEFAULT 'normal', -- baja, normal, alta, urgente
        subtotal DECIMAL(15,2) NOT NULL,
        descuento DECIMAL(15,2) DEFAULT 0,
        iva DECIMAL(15,2) NOT NULL,
        total DECIMAL(15,2) NOT NULL,
        metodo_pago NVARCHAR(50), -- efectivo, transferencia, credito, cheque
        terminos_pago NVARCHAR(100),
        observaciones NVARCHAR(MAX),
        notas_internas NVARCHAR(MAX),
        direccion_entrega NVARCHAR(MAX),
        transportista NVARCHAR(100),
        numero_guia NVARCHAR(100),
        pdf_generado BIT DEFAULT 0,
        pdf_url NVARCHAR(500),
        email_enviado BIT DEFAULT 0,
        fecha_email DATETIME,
        facturado BIT DEFAULT 0,
        numero_factura NVARCHAR(50),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (vendedor_id) REFERENCES usuarios(id)
    );
END
GO

-- ===== TABLA DE DETALLES DE PEDIDOS (ACTUALIZADA) =====
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pedido_detalles' AND xtype='U')
BEGIN
    CREATE TABLE pedido_detalles (
        id INT PRIMARY KEY IDENTITY(1,1),
        pedido_id INT NOT NULL,
        producto_id INT NOT NULL,
        cantidad DECIMAL(15,3) NOT NULL,
        precio_unitario DECIMAL(15,4) NOT NULL,
        descuento_unitario DECIMAL(15,4) DEFAULT 0,
        subtotal DECIMAL(15,2) NOT NULL,
        notas NVARCHAR(255),
        lote NVARCHAR(50),
        fecha_vencimiento DATETIME,
        entregado DECIMAL(15,3) DEFAULT 0,
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos(id)
    );
END
GO

-- ===== TABLA DE PROMOCIONES (ACTUALIZADA) =====
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='promociones' AND xtype='U')
BEGIN
    CREATE TABLE promociones (
        id INT PRIMARY KEY IDENTITY(1,1),
        codigo NVARCHAR(50) UNIQUE,
        nombre NVARCHAR(150) NOT NULL,
        descripcion NVARCHAR(MAX),
        tipo NVARCHAR(50) NOT NULL, -- porcentaje, monto_fijo, producto_gratis, 2x1
        valor DECIMAL(15,4) NOT NULL,
        fecha_inicio DATETIME NOT NULL,
        fecha_fin DATETIME NOT NULL,
        activo BIT DEFAULT 1,
        limite_usos INT,
        usos_actuales INT DEFAULT 0,
        monto_minimo DECIMAL(15,2),
        aplicable_a NVARCHAR(50) DEFAULT 'productos', -- productos, categorias, clientes, todos
        productos_incluidos NVARCHAR(MAX), -- JSON array de IDs
        productos_excluidos NVARCHAR(MAX), -- JSON array de IDs
        categorias_incluidas NVARCHAR(MAX), -- JSON array
        clientes_incluidos NVARCHAR(MAX), -- JSON array de IDs
        tipos_cliente NVARCHAR(MAX), -- JSON array: regular, mayorista, etc
        dias_semana NVARCHAR(50), -- JSON array: 1,2,3,4,5,6,7
        horas_aplicacion NVARCHAR(50), -- JSON object: {inicio: "09:00", fin: "18:00"}
        combinar_con_otras BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- ===== TABLA DE VISITAS (ACTUALIZADA) =====
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='visitas' AND xtype='U')
BEGIN
    CREATE TABLE visitas (
        id INT PRIMARY KEY IDENTITY(1,1),
        vendedor_id INT NOT NULL,
        cliente_id INT NOT NULL,
        fecha_programada DATETIME,
        fecha_real DATETIME DEFAULT GETDATE(),
        tipo NVARCHAR(50) DEFAULT 'comercial', -- comercial, cobranza, entrega, servicio
        estado NVARCHAR(50) DEFAULT 'completada', -- programada, en_curso, completada, cancelada
        latitud DECIMAL(10, 8),
        longitud DECIMAL(11, 8),
        precision_gps DECIMAL(10,2), -- en metros
        observaciones NVARCHAR(MAX),
        productos_mostrados NVARCHAR(MAX), -- JSON array de IDs
        muestras_entregadas NVARCHAR(MAX), -- JSON array
        fotos NVARCHAR(MAX), -- JSON array de URLs
        duracion_minutos INT,
        resultado NVARCHAR(50), -- exitosa, sin_interes, reagendar, no_localizado
        proxima_visita DATETIME,
        pedido_generado_id INT,
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (pedido_generado_id) REFERENCES pedidos(id)
    );
END
GO

-- ===== TABLA DE RUTAS DE VENTA (ACTUALIZADA) =====
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='rutas_ventas' AND xtype='U')
BEGIN
    CREATE TABLE rutas_ventas (
        id INT PRIMARY KEY IDENTITY(1,1),
        nombre NVARCHAR(100) NOT NULL,
        descripcion NVARCHAR(255),
        vendedor_id INT NOT NULL,
        dia_semana INT, -- 1=Lunes, 7=Domingo
        hora_inicio TIME,
        hora_fin TIME,
        activa BIT DEFAULT 1,
        orden_visitas NVARCHAR(MAX), -- JSON array con orden de clientes
        distancia_total_km DECIMAL(10,2),
        tiempo_estimado_minutos INT,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (vendedor_id) REFERENCES usuarios(id)
    );
END
GO

-- ===== TABLA DE CLIENTES EN RUTAS =====
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ruta_clientes' AND xtype='U')
BEGIN
    CREATE TABLE ruta_clientes (
        id INT PRIMARY KEY IDENTITY(1,1),
        ruta_id INT NOT NULL,
        cliente_id INT NOT NULL,
        orden INT NOT NULL,
        tiempo_estimado_minutos INT DEFAULT 30,
        frecuencia_visita_dias INT DEFAULT 7,
        ultima_visita DATETIME,
        proxima_visita DATETIME,
        activo BIT DEFAULT 1,
        notas NVARCHAR(255),
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (ruta_id) REFERENCES rutas_ventas(id) ON DELETE CASCADE,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    );
END
GO

-- ===== TABLA DE INVENTARIO (NUEVA) =====
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='inventario_movimientos' AND xtype='U')
BEGIN
    CREATE TABLE inventario_movimientos (
        id INT PRIMARY KEY IDENTITY(1,1),
        producto_id INT NOT NULL,
        tipo_movimiento NVARCHAR(50) NOT NULL, -- entrada, salida, ajuste, merma
        cantidad DECIMAL(15,3) NOT NULL,
        cantidad_anterior DECIMAL(15,3) NOT NULL,
        cantidad_nueva DECIMAL(15,3) NOT NULL,
        costo_unitario DECIMAL(15,4),
        costo_total DECIMAL(15,2),
        referencia_tipo NVARCHAR(50), -- pedido, compra, ajuste, merma
        referencia_id INT,
        motivo NVARCHAR(255),
        usuario_id INT NOT NULL,
        fecha DATETIME DEFAULT GETDATE(),
        lote NVARCHAR(50),
        fecha_vencimiento DATETIME,
        ubicacion NVARCHAR(100),
        FOREIGN KEY (producto_id) REFERENCES productos(id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
END
GO

-- ===== TABLA DE SESIONES DE USUARIO (ACTUALIZADA) =====
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='sesiones_usuario' AND xtype='U')
BEGIN
    CREATE TABLE sesiones_usuario (
        id INT PRIMARY KEY IDENTITY(1,1),
        usuario_id INT NOT NULL,
        token NVARCHAR(500) NOT NULL,
        ip_address NVARCHAR(45),
        user_agent NVARCHAR(MAX),
        dispositivo NVARCHAR(100),
        ubicacion NVARCHAR(100),
        activa BIT DEFAULT 1,
        ultimo_acceso DATETIME DEFAULT GETDATE(),
        created_at DATETIME DEFAULT GETDATE(),
        expires_at DATETIME NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );
END
GO

-- ===== TABLA DE LOGS DE ACTIVIDAD (NUEVA) =====
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='logs_actividad' AND xtype='U')
BEGIN
    CREATE TABLE logs_actividad (
        id INT PRIMARY KEY IDENTITY(1,1),
        usuario_id INT,
        accion NVARCHAR(100) NOT NULL,
        tabla_afectada NVARCHAR(50),
        registro_id INT,
        datos_anteriores NVARCHAR(MAX), -- JSON
        datos_nuevos NVARCHAR(MAX), -- JSON
        ip_address NVARCHAR(45),
        user_agent NVARCHAR(MAX),
        timestamp DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
END
GO

-- ===== TABLA DE NOTIFICACIONES (NUEVA) =====
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='notificaciones' AND xtype='U')
BEGIN
    CREATE TABLE notificaciones (
        id INT PRIMARY KEY IDENTITY(1,1),
        usuario_id INT NOT NULL,
        titulo NVARCHAR(150) NOT NULL,
        mensaje NVARCHAR(MAX) NOT NULL,
        tipo NVARCHAR(50) DEFAULT 'info', -- info, success, warning, error
        categoria NVARCHAR(50), -- sistema, ventas, inventario, cliente
        leida BIT DEFAULT 0,
        accion_url NVARCHAR(500),
        accion_texto NVARCHAR(100),
        prioridad NVARCHAR(20) DEFAULT 'normal', -- baja, normal, alta, critica
        expira_en DATETIME,
        created_at DATETIME DEFAULT GETDATE(),
        leida_en DATETIME,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );
END
GO

-- ===== ÍNDICES PARA RENDIMIENTO =====

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);

-- Índices para clientes
CREATE INDEX IF NOT EXISTS idx_clientes_vendedor ON clientes(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_clientes_activo ON clientes(activo);
CREATE INDEX IF NOT EXISTS idx_clientes_tipo ON clientes(tipo);
CREATE INDEX IF NOT EXISTS idx_clientes_codigo ON clientes(codigo_cliente);

-- Índices para productos
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON productos(codigo);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);

-- Índices para pedidos
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_vendedor ON pedidos(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_numero ON pedidos(numero);

-- Índices para visitas
CREATE INDEX IF NOT EXISTS idx_visitas_vendedor ON visitas(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_visitas_cliente ON visitas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_visitas_fecha ON visitas(fecha_real);

-- ===== DATOS INICIALES DE PRODUCCIÓN =====

-- Configuración del sistema
INSERT INTO sistema_config (clave, valor, descripcion, tipo) VALUES
('app_name', 'Trigal CRM', 'Nombre de la aplicación', 'string'),
('app_version', '1.2.0', 'Versión actual del sistema', 'string'),
('empresa_nombre', 'Productos Trigal S.A. de C.V.', 'Nombre de la empresa', 'string'),
('empresa_rfc', 'PTR123456789', 'RFC de la empresa', 'string'),
('empresa_direccion', 'Av. Maíz 123, Col. Agricultura, CP 12345, Ciudad de México', 'Dirección fiscal', 'string'),
('empresa_telefono', '+52 55 1234 5678', 'Teléfono principal', 'string'),
('empresa_email', 'contacto@trigal.com', 'Email corporativo', 'string'),
('moneda_default', 'MXN', 'Moneda por defecto', 'string'),
('iva_default', '16', 'IVA por defecto', 'number'),
('backup_automatico', 'true', 'Respaldo automático activado', 'boolean'),
('mantenimiento_modo', 'false', 'Modo mantenimiento', 'boolean');

-- Usuario administrador principal de producción
INSERT INTO usuarios (username, email, password_hash, nombre, apellido, rol, telefono, zona, activo) VALUES
('admin', 'admin@trigal.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'Sistema', 'admin', '+52 55 1234 5678', 'Corporativo', 1);

-- Gerente de ventas
INSERT INTO usuarios (username, email, password_hash, nombre, apellido, rol, telefono, zona, activo) VALUES
('gerente.ventas', 'gerente@trigal.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'María', 'González', 'gerente_ventas', '+52 55 2345 6789', 'Centro', 1);

-- Vendedores
INSERT INTO usuarios (username, email, password_hash, nombre, apellido, rol, telefono, zona, activo) VALUES
('vendedor.norte', 'vendedor.norte@trigal.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos', 'Ruiz', 'vendedor', '+52 55 3456 7890', 'Norte', 1),
('vendedor.sur', 'vendedor.sur@trigal.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ana', 'López', 'vendedor', '+52 55 4567 8901', 'Sur', 1),
('vendedor.este', 'vendedor.este@trigal.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Luis', 'Martínez', 'vendedor', '+52 55 5678 9012', 'Este', 1),
('vendedor.oeste', 'vendedor.oeste@trigal.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rosa', 'Fernández', 'vendedor', '+52 55 6789 0123', 'Oeste', 1);

-- Gerente de finanzas
INSERT INTO usuarios (username, email, password_hash, nombre, apellido, rol, telefono, zona, activo) VALUES
('gerente.finanzas', 'finanzas@trigal.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Roberto', 'Hernández', 'gerente_finanzas', '+52 55 7890 1234', 'Corporativo', 1);

-- Productos especializados en maíz
INSERT INTO productos (codigo, nombre, descripcion, categoria, unidad, precio_base, iva, precio_venta, precio_mayorista, precio_distribuidor, costo, stock, stock_minimo, activo, destacado) VALUES
('MAIZ001', 'Maíz Cacahuazintle Blanco Premium', 'Maíz cacahuazintle de primera calidad para pozole, grano grande y uniforme', 'Granos', 'kg', 28.00, 16, 32.48, 30.00, 28.50, 22.00, 5000, 500, 1, 1),
('MAIZ002', 'Maíz Amarillo Dent Forrajero', 'Maíz amarillo tipo dent para alimentación animal y procesamiento industrial', 'Granos', 'kg', 18.50, 16, 21.46, 20.00, 19.00, 15.00, 10000, 1000, 1, 0),
('MAIZ003', 'Maíz Blanco Dentado', 'Maíz blanco dentado para tortillería y consumo humano', 'Granos', 'kg', 22.00, 16, 25.52, 24.00, 22.50, 18.00, 7500, 750, 1, 1),
('MAIZ004', 'Maíz Pozolero Gigante', 'Maíz especial para pozole, grano extra grande seleccionado', 'Granos', 'kg', 35.00, 16, 40.60, 38.00, 36.00, 28.00, 2000, 200, 1, 1),
('HARINA001', 'Harina de Maíz Nixtamalizada', 'Harina de maíz nixtamalizada premium para tortillas artesanales', 'Harinas', 'kg', 20.00, 16, 23.20, 22.00, 21.00, 16.00, 3000, 300, 1, 1),
('HARINA002', 'Harina de Maíz Integral', 'Harina de maíz integral con fibra, ideal para productos saludables', 'Harinas', 'kg', 25.00, 16, 29.00, 27.00, 26.00, 20.00, 1500, 150, 1, 0),
('DERIVADO001', 'Grits de Maíz Amarillo', 'Sémola de maíz amarillo para cereales y productos procesados', 'Derivados', 'kg', 15.00, 16, 17.40, 16.50, 15.75, 12.00, 4000, 400, 1, 0),
('DERIVADO002', 'Almidón de Maíz Premium', 'Almidón de maíz de alta pureza para industria alimentaria', 'Derivados', 'kg', 45.00, 16, 52.20, 48.00, 46.00, 35.00, 800, 80, 1, 1),
('PROCESADO001', 'Elote Desgranado Congelado', 'Granos de elote dulce congelado, listo para consumo', 'Procesados', 'kg', 35.00, 16, 40.60, 38.00, 36.00, 28.00, 500, 50, 1, 1),
('PROCESADO002', 'Esquites Precocidos', 'Elotes baby precocidos para esquites gourmet', 'Procesados', 'kg', 42.00, 16, 48.72, 45.00, 43.00, 32.00, 300, 30, 1, 1);

-- Clientes de ejemplo distribuidos por zonas
INSERT INTO clientes (codigo_cliente, nombre, contacto, email, telefono, direccion, ciudad, estado, codigo_postal, latitud, longitud, vendedor_id, activo, tipo, limite_credito, dias_credito) VALUES
('CLI001', 'Tortillería La Esperanza', 'Juan Pérez', 'juan@laesperanza.com', '+52 55 1111 2222', 'Av. Insurgentes 123, Col. Centro', 'Ciudad de México', 'CDMX', '06000', 19.4326, -99.1332, 3, 1, 'mayorista', 100000, 30),
('CLI002', 'Molinos del Valle', 'Ana López', 'ana@molinosdelvalle.com', '+52 33 2222 3333', 'Calle Reforma 456, Col. Industrial', 'Guadalajara', 'Jalisco', '44100', 20.6597, -103.3496, 4, 1, 'distribuidor', 200000, 45),
('CLI003', 'Distribuidora del Norte', 'Carlos Sánchez', 'carlos@distribuidoranorte.com', '+52 81 3333 4444', 'Blvd. Constitución 789, Col. Moderna', 'Monterrey', 'Nuevo León', '64000', 25.6866, -100.3161, 3, 1, 'distribuidor', 150000, 30),
('CLI004', 'Tortillería San Miguel', 'María García', 'maria@sanmiguel.com', '+52 55 4444 5555', 'Calle Morelos 321, Col. San Miguel', 'Ciudad de México', 'CDMX', '11000', 19.4830, -99.1596, 3, 1, 'regular', 50000, 15),
('CLI005', 'Alimentos Procesados del Sur', 'Roberto Díaz', 'roberto@alimentossur.com', '+52 961 5555 6666', 'Av. Central 654, Col. Centro', 'Tuxtla Gutiérrez', 'Chiapas', '29000', 16.7516, -93.1161, 4, 1, 'mayorista', 120000, 30),
('CLI006', 'Supermercados Oriente', 'Laura Jiménez', 'laura@superoriente.com', '+52 229 6666 7777', 'Blvd. Ávila Camacho 987, Col. Costa Verde', 'Veracruz', 'Veracruz', '91700', 19.1738, -96.1342, 5, 1, 'mayorista', 180000, 45),
('CLI007', 'Tortillería El Maizal', 'Pedro Ramírez', 'pedro@elmaizal.com', '+52 33 7777 8888', 'Calle Hidalgo 147, Col. Centro', 'Guadalajara', 'Jalisco', '44100', 20.6597, -103.3496, 4, 1, 'regular', 40000, 15),
('CLI008', 'Productos Alimenticios del Pacífico', 'Carmen Morales', 'carmen@pacifico.com', '+52 669 8888 9999', 'Av. Obregón 258, Col. Centro', 'Mazatlán', 'Sinaloa', '82000', 23.2494, -106.4103, 6, 1, 'distribuidor', 250000, 60);

-- Promociones activas
INSERT INTO promociones (codigo, nombre, descripcion, tipo, valor, fecha_inicio, fecha_fin, activo, limite_usos, monto_minimo, aplicable_a, productos_incluidos) VALUES
('PROMO001', 'Descuento Maíz Cacahuazintle', 'Descuento del 10% en compras mayores a 100kg de maíz cacahuazintle', 'porcentaje', 10.00, GETDATE(), DATEADD(month, 3, GETDATE()), 1, 100, 3000, 'productos', '[1,4]'),
('PROMO002', 'Mayorista Especial', '15% de descuento para distribuidores en pedidos mayores a $50,000', 'porcentaje', 15.00, GETDATE(), DATEADD(month, 6, GETDATE()), 1, 50, 50000, 'clientes', '[]'),
('PROMO003', 'Lanzamiento Harina Integral', '20% de descuento en harina de maíz integral', 'porcentaje', 20.00, GETDATE(), DATEADD(month, 1, GETDATE()), 1, 200, 0, 'productos', '[6]');

PRINT 'Base de datos de producción creada exitosamente para Trigal CRM v1.2.0';
GO
