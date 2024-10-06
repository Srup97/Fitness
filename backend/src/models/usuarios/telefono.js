import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';
import Persona from './persona.js';

const Telefono = sequelize.define('Telefono', {
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
  tipo: {
    type: DataTypes.ENUM('Casa', 'Trabajo', 'Celular'),
    allowNull: false,
  },
  numero: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  tableName: 'telefono',
  timestamps: false,
});

Persona.hasMany(Telefono, { foreignKey: 'persona_id' });
Telefono.belongsTo(Persona, { foreignKey: 'persona_id' });

export default Telefono;
