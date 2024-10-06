import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const DatosMembresia = sequelize.define('DatosMembresia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  costo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  modalidad: {
    type: DataTypes.ENUM('mensual', 'quincenal', 'anual'),
    allowNull: false
  }
}, {
  tableName: 'datos_membresia',
  timestamps: false,
  charset: 'utf8',
  collate: 'utf8_general_ci'
});

export default DatosMembresia;
