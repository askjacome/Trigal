-- Script de creación de base de datos para CRM Trigal en Azure SQL Server
-- Ejecutar en Azure SQL Database después de crear la base de datos

USE [trigal_crm];
GO

-- Tabla de Usuarios y Seguridad
CREATE TABLE [usuarios] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [username] NVARCHAR(50) NOT NULL UNIQUE,
    [email] NVARCHAR(100) NOT NULL UNIQUE,
    [password_hash] NVARCHAR(255) NOT NULL,
    [nombre] NVARCHAR(100) NOT NULL,
    [apellido] NVARCHAR(100) NOT NULL,
    [rol] NVARCHAR(20) NOT NULL DEFAULT 'vendedor' CHECK ([rol] IN ('admin', 'vendedor', 'supervisor', 'cliente')),
    [activo] BIT NOT NULL DEFAULT 1,
    [ultimo_acceso] DATETIME2,
    [created_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Índices para usuarios
CREATE INDEX [IX_usuarios_username] ON [usuarios] ([username]);
CREATE INDEX [IX_usuarios_email] ON [usuarios] ([email]);
CREATE INDEX [IX_usuarios_rol] ON [usuarios] ([rol]);
GO

-- Trigger para actualizar updated_at en usuarios
CREATE TRIGGER [TR_usuarios_updated_at]
ON [usuarios]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [usuarios]
    SET [updated_at] = GETDATE()
    FROM [usuarios] u
    INNER JOIN [inserted] i ON u.[id] = i.[id];
END;
GO

-- Tabla de Clientes
CREATE TABLE [clientes] (
    [id] NVARCHAR(10) PRIMARY KEY,
    [nombre] NVARCHAR(200) NOT NULL,
    [razon_social] NVARCHAR(200),
    [rfc] NVARCHAR(20) UNIQUE,
    [direccion] NVARCHAR(MAX),
    [telefono] NVARCHAR(20),
    [email] NVARCHAR(100),
    [vendedor_id] INT,
    [condiciones_pago] NVARCHAR(50) DEFAULT 'Contado',
    [estado] NVARCHAR(20) NOT NULL DEFAULT 'Activo' CHECK ([estado] IN ('Activo', 'Inactivo', 'Suspendido')),
    [region] NVARCHAR(50),
    [limite_credito] DECIMAL(10,2) DEFAULT 0.00,
    [created_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    FOREIGN KEY ([vendedor_id]) REFERENCES [usuarios]([id])
);
GO

-- Índices para clientes
CREATE INDEX [IX_clientes_vendedor] ON [clientes] ([vendedor_id]);
CREATE INDEX [IX_clientes_estado] ON [clientes] ([estado]);
CREATE INDEX [IX_clientes_region] ON [clientes] ([region]);
GO

-- Trigger para actualizar updated_at en clientes
CREATE TRIGGER [TR_clientes_updated_at]
ON [clientes]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [clientes]
    SET [updated_at] = GETDATE()
    FROM [clientes] c
    INNER JOIN [inserted] i ON c.[id] = i.[id];
END;
GO

-- Tabla de Productos
CREATE TABLE [productos] (
    [id] NVARCHAR(10) PRIMARY KEY,
    [sku] NVARCHAR(50) NOT NULL UNIQUE,
    [nombre] NVARCHAR(200) NOT NULL,
    [categoria] NVARCHAR(100),
    [marca] NVARCHAR(100),
    [precio] DECIMAL(10,2) NOT NULL,
    [precio_original] DECIMAL(10,2),
    [stock] INT DEFAULT 0,
    [stock_minimo] INT DEFAULT 10,
    [descripcion] NVARCHAR(MAX),
    [especificaciones] NVARCHAR(MAX), -- JSON como texto en SQL Server
    [imagenes] NVARCHAR(MAX), -- JSON como texto en SQL Server
    [activo] BIT DEFAULT 1,
    [created_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- Índices para productos
CREATE INDEX [IX_productos_sku] ON [productos] ([sku]);
CREATE INDEX [IX_productos_categoria] ON [productos] ([categoria]);
CREATE INDEX [IX_productos_activo] ON [productos] ([activo]);
CREATE INDEX [IX_productos_stock] ON [productos] ([stock]);
GO

-- Trigger para productos
CREATE TRIGGER [TR_productos_updated_at]
ON [productos]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [productos]
    SET [updated_at] = GETDATE()
    FROM [productos] p
    INNER JOIN [inserted] i ON p.[id] = i.[id];
END;
GO

-- Tabla de Pedidos
CREATE TABLE [pedidos] (
    [id] NVARCHAR(10) PRIMARY KEY,
    [cliente_id] NVARCHAR(10) NOT NULL,
    [vendedor_id] INT NOT NULL,
    [fecha_pedido] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [fecha_entrega] DATE,
    [estado] NVARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK ([estado] IN ('Pendiente', 'Procesando', 'Entregado', 'Cancelado')),
    [subtotal] DECIMAL(10,2) NOT NULL,
    [impuestos] DECIMAL(10,2) DEFAULT 0.00,
    [total] DECIMAL(10,2) NOT NULL,
    [observaciones] NVARCHAR(MAX),
    [direccion_entrega] NVARCHAR(MAX),
    [created_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    FOREIGN KEY ([cliente_id]) REFERENCES [clientes]([id]),
    FOREIGN KEY ([vendedor_id]) REFERENCES [usuarios]([id])
);
GO

-- Índices para pedidos
CREATE INDEX [IX_pedidos_cliente] ON [pedidos] ([cliente_id]);
CREATE INDEX [IX_pedidos_vendedor] ON [pedidos] ([vendedor_id]);
CREATE INDEX [IX_pedidos_estado] ON [pedidos] ([estado]);
CREATE INDEX [IX_pedidos_fecha] ON [pedidos] ([fecha_pedido]);
GO

-- Trigger para pedidos
CREATE TRIGGER [TR_pedidos_updated_at]
ON [pedidos]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [pedidos]
    SET [updated_at] = GETDATE()
    FROM [pedidos] p
    INNER JOIN [inserted] i ON p.[id] = i.[id];
END;
GO

-- Tabla de Detalle de Pedidos
CREATE TABLE [pedido_detalles] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [pedido_id] NVARCHAR(10) NOT NULL,
    [producto_id] NVARCHAR(10) NOT NULL,
    [cantidad] INT NOT NULL,
    [precio_unitario] DECIMAL(10,2) NOT NULL,
    [subtotal] DECIMAL(10,2) NOT NULL,
    
    FOREIGN KEY ([pedido_id]) REFERENCES [pedidos]([id]) ON DELETE CASCADE,
    FOREIGN KEY ([producto_id]) REFERENCES [productos]([id])
);
GO

-- Índices para pedido_detalles
CREATE INDEX [IX_pedido_detalles_pedido] ON [pedido_detalles] ([pedido_id]);
CREATE INDEX [IX_pedido_detalles_producto] ON [pedido_detalles] ([producto_id]);
GO

-- Tabla de Rutas de Ventas
CREATE TABLE [rutas_ventas] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [vendedor_id] INT NOT NULL,
    [nombre] NVARCHAR(100) NOT NULL,
    [fecha_ruta] DATE NOT NULL,
    [estado] NVARCHAR(20) NOT NULL DEFAULT 'Planificada' CHECK ([estado] IN ('Planificada', 'En_Progreso', 'Completada', 'Cancelada')),
    [observaciones] NVARCHAR(MAX),
    [created_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    FOREIGN KEY ([vendedor_id]) REFERENCES [usuarios]([id])
);
GO

-- Índices para rutas_ventas
CREATE INDEX [IX_rutas_ventas_vendedor] ON [rutas_ventas] ([vendedor_id]);
CREATE INDEX [IX_rutas_ventas_fecha] ON [rutas_ventas] ([fecha_ruta]);
CREATE INDEX [IX_rutas_ventas_estado] ON [rutas_ventas] ([estado]);
GO

-- Trigger para rutas_ventas
CREATE TRIGGER [TR_rutas_ventas_updated_at]
ON [rutas_ventas]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [rutas_ventas]
    SET [updated_at] = GETDATE()
    FROM [rutas_ventas] rv
    INNER JOIN [inserted] i ON rv.[id] = i.[id];
END;
GO

-- Tabla de Clientes en Ruta
CREATE TABLE [ruta_clientes] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [ruta_id] INT NOT NULL,
    [cliente_id] NVARCHAR(10) NOT NULL,
    [orden_visita] INT,
    [hora_estimada] TIME,
    [hora_visita] DATETIME2,
    [estado_visita] NVARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK ([estado_visita] IN ('Pendiente', 'Visitado', 'No_Visitado')),
    [latitud] DECIMAL(10, 8),
    [longitud] DECIMAL(11, 8),
    [observaciones] NVARCHAR(MAX),
    
    FOREIGN KEY ([ruta_id]) REFERENCES [rutas_ventas]([id]) ON DELETE CASCADE,
    FOREIGN KEY ([cliente_id]) REFERENCES [clientes]([id])
);
GO

-- Índices para ruta_clientes
CREATE INDEX [IX_ruta_clientes_ruta] ON [ruta_clientes] ([ruta_id]);
CREATE INDEX [IX_ruta_clientes_cliente] ON [ruta_clientes] ([cliente_id]);
CREATE INDEX [IX_ruta_clientes_estado] ON [ruta_clientes] ([estado_visita]);
GO

-- Tabla de Sesiones de Usuario (opcional)
CREATE TABLE [sesiones_usuario] (
    [id] NVARCHAR(128) PRIMARY KEY,
    [usuario_id] INT NOT NULL,
    [ip_address] NVARCHAR(45),
    [user_agent] NVARCHAR(MAX),
    [ultima_actividad] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [activa] BIT DEFAULT 1,
    
    FOREIGN KEY ([usuario_id]) REFERENCES [usuarios]([id]) ON DELETE CASCADE
);
GO

-- Índices para sesiones_usuario
CREATE INDEX [IX_sesiones_usuario_usuario] ON [sesiones_usuario] ([usuario_id]);
CREATE INDEX [IX_sesiones_usuario_activa] ON [sesiones_usuario] ([activa]);
GO

-- Insertar datos de ejemplo

-- Usuario administrador por defecto (password: admin123)
INSERT INTO [usuarios] ([username], [email], [password_hash], [nombre], [apellido], [rol]) 
VALUES ('admin', 'admin@trigal.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/BqsZE1aLS', 'Administrador', 'Sistema', 'admin');
GO

-- Productos de maíz especializados
INSERT INTO [productos] ([id], [sku], [nombre], [categoria], [marca], [precio], [precio_original], [stock], [descripcion]) VALUES
('PROD001', 'MAIZ001', 'Maíz Cacahuazintle para Pozole', 'Granos', 'Trigal', 45.00, 45.00, 100, 'Maíz cacahuazintle premium, ideal para pozole tradicional. Grano grande y blanco.'),
('PROD002', 'TOST001', 'Tostadas de Maíz Natural', 'Derivados', 'Trigal', 12.50, 12.50, 200, 'Tostadas crujientes de maíz natural, sin conservadores artificiales.'),
('PROD003', 'MAIZ002', 'Maíz Blanco para Pozole', 'Granos', 'Trigal', 38.00, 38.00, 150, 'Maíz blanco especial para pozole, cocción rápida y sabor tradicional.'),
('PROD004', 'TOST002', 'Tostadas de Maíz Azul', 'Derivados', 'Trigal', 15.00, 15.00, 80, 'Tostadas de maíz azul, ricas en antioxidantes y sabor único.'),
('PROD005', 'HARIN001', 'Harina de Maíz', 'Harinas', 'Trigal', 95.00, 95.00, 50, 'Harina de maíz premium para tortillas, tamales y repostería mexicana.');
GO

-- Cliente de ejemplo
INSERT INTO [clientes] ([id], [nombre], [razon_social], [rfc], [direccion], [telefono], [email], [vendedor_id], [region]) 
VALUES ('C001', 'Distribuidora El Sol S.A.', 'Distribuidora El Sol, S.A. de C.V.', 'ABC123456XYZ', 'Av. Insurgentes Sur 1234, Col. Del Valle, CDMX', '+52 55 1234 5678', 'contacto@elsol.com', 1, 'Centro');
GO

-- Verificar datos insertados
SELECT 'Usuarios creados' as tabla, COUNT(*) as total FROM [usuarios]
UNION ALL
SELECT 'Productos creados', COUNT(*) FROM [productos]
UNION ALL
SELECT 'Clientes creados', COUNT(*) FROM [clientes];
GO

-- Mostrar información de tablas
SELECT 
    t.name AS tabla,
    p.rows AS filas,
    (SUM(a.used_pages) * 8) / 1024 AS 'Tamaño_MB'
FROM sys.tables t
INNER JOIN sys.indexes i ON t.object_id = i.object_id
INNER JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
INNER JOIN sys.allocation_units a ON p.partition_id = a.container_id
WHERE t.name IN ('usuarios', 'clientes', 'productos', 'pedidos')
GROUP BY t.name, p.rows
ORDER BY t.name;
GO
