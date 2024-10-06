import bcrypt from 'bcryptjs';
import sequelize from '../models/index.js';

const migratePasswords = async () => {
  try {
    // Obtén todos los usuarios
    const [users] = await sequelize.query('SELECT id, password FROM usuario');

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await sequelize.query('UPDATE usuario SET password = ? WHERE id = ?', {
        replacements: [hashedPassword, user.id]
      });
    }

    console.log('Todas las contraseñas han sido encriptadas correctamente.');
  } catch (err) {
    console.error('Error al migrar las contraseñas:', err);
  }
};

migratePasswords();
