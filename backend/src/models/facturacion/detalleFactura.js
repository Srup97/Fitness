// models/detalleFactura.js
import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';
import Usuario from '../usuarios/usuario.js'; // Importar el modelo Usuario
import Factura from './factura.js';

const DetalleFactura = sequelize.define('DetalleFactura', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  factura_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Factura', // Usar el nombre del modelo como string
      key: 'id',
    },
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  monto_total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cantidad: { // Campo para la cantidad de productos
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  devuelta: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'detallefactura',
});

DetalleFactura.belongsTo(Factura, { foreignKey: 'factura_id' });

export default DetalleFactura;
