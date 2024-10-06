import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  persona_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'persona',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
}, {
  tableName: 'usuario',
  timestamps: false,
});

export default Usuario;
