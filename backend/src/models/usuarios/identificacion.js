import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';
import Persona from './persona.js';

const Identificacion = sequelize.define('Identificacion', {
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
    type: DataTypes.ENUM('DNI', 'Pasaporte', 'Otro'),
    allowNull: false,
  },
  numero: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'identificacion',
  timestamps: false,
});

Persona.hasMany(Identificacion, { foreignKey: 'persona_id' });
Identificacion.belongsTo(Persona, { foreignKey: 'persona_id' });

export default Identificacion;
