import sequelize from '../db.js';
import DatosMembresia from './membresias/datos_membresia.js';
import MembresiaUsuario from './membresias/MembresiaUsuario.js';
import Usuario from './usuarios/usuario.js';
import Factura from './facturacion/factura.js';
import DetalleFactura from './facturacion/detalleFactura.js';
import FacturaTipo from './facturacion/facturaTipo.js';
import Persona from './usuarios/persona.js';
import Telefono from './usuarios/telefono.js';
import Direccion from './usuarios/direccion.js';
// Definir las relaciones
DatosMembresia.hasMany(MembresiaUsuario, { foreignKey: 'type_id', as: 'membresias' });
MembresiaUsuario.belongsTo(DatosMembresia, { foreignKey: 'type_id', as: 'datosMembresia' });

Persona.hasMany(Usuario, { foreignKey: 'persona_id', as: 'usuarios' });
Usuario.belongsTo(Persona, { foreignKey: 'persona_id', as: 'persona' });

Direccion.belongsTo(Persona, { foreignKey: 'persona_id', as : 'persona'});
Persona.hasMany(Direccion, {foreignKey: 'persona_id', as: 'direccion'});

Telefono.belongsTo(Persona, { foreignKey: 'persona_id', as: 'persona'});
Persona.hasMany(Telefono, { foreignKey: 'persona_id', as: 'telefonos' });

Usuario.hasMany(MembresiaUsuario, { foreignKey: 'user_id', as: 'membresias' });
MembresiaUsuario.belongsTo(Usuario, { foreignKey: 'user_id', as: 'usuario' });

Factura.belongsTo(FacturaTipo, { foreignKey: 'id_tipo', as: 'tipoFactura' });
FacturaTipo.hasMany(Factura, { foreignKey: 'id_tipo', as: 'facturas' });

Factura.hasMany(DetalleFactura, { foreignKey: 'factura_id', as: 'detallesFactura' });
DetalleFactura.belongsTo(Factura, { foreignKey: 'factura_id', as: 'factura' });
DetalleFactura.belongsTo(Usuario, { foreignKey: 'id_cliente', as: 'cliente' });

const models = {
  DatosMembresia,
  MembresiaUsuario,
  Usuario,
  Factura,
  DetalleFactura,
  FacturaTipo,
  Persona,
  Telefono,
  Direccion,
  sequelize,
};

export {
  Direccion,
  Telefono,
  Persona,
  DatosMembresia,
  MembresiaUsuario,
  Usuario,
  Factura,
  DetalleFactura,
  FacturaTipo,
  sequelize,
};
