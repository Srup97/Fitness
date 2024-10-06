import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';
import Persona from './persona.js';

const Direccion = sequelize.define('Direccion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  persona_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Persona,
      key: 'id',
    },
  },
  calle: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ciudad: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  pais: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'direccion',
  timestamps: false,
});

Persona.hasMany(Direccion, { foreignKey: 'persona_id' });
Direccion.belongsTo(Persona, { foreignKey: 'persona_id' });

export default Direccion;
