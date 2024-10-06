//MembresiaUsuario.js

import sequelize from '../../db.js';
import { DataTypes } from 'sequelize';

const MembresiaUsuario = sequelize.define('MembresiaUsuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('activa', 'inactiva', 'expirada'),
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'membresia_usuario',
  timestamps: false,
});

export default MembresiaUsuario;
