import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const Persona = sequelize.define('Persona', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha_nacimiento: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'persona',
  timestamps: false,
});

export default Persona;
