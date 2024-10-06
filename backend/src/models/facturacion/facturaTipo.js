// models/facturacion/facturaTipo.js
import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const FacturaTipo = sequelize.define('FacturaTipo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'factura_tipo',
});

export default FacturaTipo;
