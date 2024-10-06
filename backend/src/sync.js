// syncDatabase.js
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import models from './models/index.js';

const { sequelize, FacturaTipo } = models; // Extraer sequelize de models para su uso

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  }
};

syncDatabase();
