const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// Importar modelos
const User = require('./User')(sequelize, DataTypes);
const Cliente = require('./Cliente')(sequelize, DataTypes);
const Producto = require('./Producto')(sequelize, DataTypes);
const Pedido = require('./Pedido')(sequelize, DataTypes);
const PedidoDetalle = require('./PedidoDetalle')(sequelize, DataTypes);
const RutaVenta = require('./RutaVenta')(sequelize, DataTypes);
const RutaCliente = require('./RutaCliente')(sequelize, DataTypes);

// Definir asociaciones
const defineAssociations = () => {
  // Usuario - Cliente (vendedor asignado)
  User.hasMany(Cliente, { foreignKey: 'vendedor_id', as: 'clientes' });
  Cliente.belongsTo(User, { foreignKey: 'vendedor_id', as: 'vendedor' });

  // Usuario - Pedido (vendedor que toma el pedido)
  User.hasMany(Pedido, { foreignKey: 'vendedor_id', as: 'pedidos' });
  Pedido.belongsTo(User, { foreignKey: 'vendedor_id', as: 'vendedor' });

  // Cliente - Pedido
  Cliente.hasMany(Pedido, { foreignKey: 'cliente_id', as: 'pedidos' });
  Pedido.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

  // Pedido - PedidoDetalle
  Pedido.hasMany(PedidoDetalle, { foreignKey: 'pedido_id', as: 'detalles' });
  PedidoDetalle.belongsTo(Pedido, { foreignKey: 'pedido_id', as: 'pedido' });

  // Producto - PedidoDetalle
  Producto.hasMany(PedidoDetalle, { foreignKey: 'producto_id', as: 'detallesPedido' });
  PedidoDetalle.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

  // Usuario - RutaVenta
  User.hasMany(RutaVenta, { foreignKey: 'vendedor_id', as: 'rutas' });
  RutaVenta.belongsTo(User, { foreignKey: 'vendedor_id', as: 'vendedor' });

  // RutaVenta - RutaCliente
  RutaVenta.hasMany(RutaCliente, { foreignKey: 'ruta_id', as: 'clientes' });
  RutaCliente.belongsTo(RutaVenta, { foreignKey: 'ruta_id', as: 'ruta' });

  // Cliente - RutaCliente
  Cliente.hasMany(RutaCliente, { foreignKey: 'cliente_id', as: 'rutasAsignadas' });
  RutaCliente.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
};

// Llamar a las asociaciones
defineAssociations();

module.exports = {
  sequelize,
  User,
  Cliente,
  Producto,
  Pedido,
  PedidoDetalle,
  RutaVenta,
  RutaCliente
};
