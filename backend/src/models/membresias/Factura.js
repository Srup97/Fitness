// models/factura.js
import FacturaTipo from './facturaTipo.js';
import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const Factura = sequelize.define('Factura', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_tipo: {
    type: DataTypes.INTEGER, // Cambiar a INTEGER para relacionarlo con FacturaTipo
    allowNull: false,
    references: {
      model: FacturaTipo, // Asegúrate de que la referencia sea correcta
      key: 'id',
    },
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fecha_emision: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  estado_pago: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente',
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  proveedor_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'factura',
});

export default Factura;
