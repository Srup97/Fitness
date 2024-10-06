// models/index.js

import sequelize from '../db.js';
import DatosMembresia from './membresias/datos_membresia.js';
import MembresiaUsuario from './membresias/MembresiaUsuario.js';
import Usuario from './usuarios/usuario.js';
import Factura from './facturacion/factura.js';
import DetalleFactura from './facturacion/detalleFactura.js';
import FacturaTipo from './facturacion/facturaTipo.js';

// Definir las relaciones
DatosMembresia.hasMany(MembresiaUsuario, { foreignKey: 'type_id' });
MembresiaUsuario.belongsTo(DatosMembresia, { foreignKey: 'type_id' });

Usuario.hasMany(MembresiaUsuario, { foreignKey: 'user_id' });
MembresiaUsuario.belongsTo(Usuario, { foreignKey: 'user_id' });

Factura.belongsTo(FacturaTipo, { foreignKey: 'id_tipo' }); // Relación con FacturaTipo

Factura.hasMany(DetalleFactura, { foreignKey: 'factura_id' });
DetalleFactura.belongsTo(Factura, { foreignKey: 'factura_id' });
DetalleFactura.belongsTo(Usuario, { foreignKey: 'id_cliente' });

const models = {
  DatosMembresia,
  MembresiaUsuario,
  Usuario,
  Factura,
  DetalleFactura,
  FacturaTipo,
  sequelize,
};

export { DatosMembresia, MembresiaUsuario, Usuario, Factura, DetalleFactura, FacturaTipo, sequelize };
