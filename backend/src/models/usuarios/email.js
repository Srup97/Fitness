import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';
import Persona from './persona.js';

const Email = sequelize.define('Email', {
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
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'emails',
  timestamps: false,
});

Persona.hasMany(Email, { foreignKey: 'persona_id' });
Email.belongsTo(Persona, { foreignKey: 'persona_id' });

export default Email;
