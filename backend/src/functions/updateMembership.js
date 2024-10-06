
import cron from 'node-cron';
import sequelize from '../db.js';

cron.schedule('*/30 * * * *', async () => {
  // console.log('Verificando y actualizando membresías expiradas...');
  try {
    await sequelize.query(`
      UPDATE membresia_usuario
      SET status = 'expirada'
      WHERE end_date < CURDATE() AND status = 'activa'
    `);
    console.log('Membresías actualizadas correctamente.');
  } catch (error) {
    console.error('Error actualizando membresías:', error);
  }
});

export default function updateMembership() {}
