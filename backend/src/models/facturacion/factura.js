// models/facturacion/factura.js

import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';
import FacturaTipo from './facturaTipo.js'; // Importar el modelo FacturaTipo

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
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: FacturaTipo,
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
    defaultValue: 'pendiente', // Puede ser 'pendiente', 'pagado', 'cancelado', etc.
  },
}, {
  timestamps: true,
  tableName: 'factura',
});

// Definir la relación con FacturaTipo
Factura.belongsTo(FacturaTipo, { foreignKey: 'id_tipo' });

export default Factura;
