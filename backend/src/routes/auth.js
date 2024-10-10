import bcrypt from 'bcryptjs';
import router from './usuario.js';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import sequelize from '../db.js';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [results] = await sequelize.query('SELECT * FROM usuario WHERE username = :username', {
      replacements: { username }
    });

    if (results.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const [statusResults] = await sequelize.query('SELECT status FROM usuario WHERE username = :username', {
      replacements: { username }
    });

    const userStatus = statusResults[0]?.status;

    if (userStatus === 0) {
      return res.status(400).json({ message: 'Usuario suspendido' });
    }

    const [role_descripcion] = await sequelize.query(`SELECT r.name AS role_description 
      FROM usuario u 
      JOIN roles r ON u.role_id = r.id 
      WHERE u.username = :username`, {
        replacements: { username }
    });

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: role_descripcion[0].role_description
      }
    };

    sign(
      payload,
      secret,
      { expiresIn: '3h' },
      async (err, token) => {
        if (err) {
          throw err;
        }

        await sequelize.query('UPDATE usuario SET last_token = :token, last_activity = NOW() WHERE id = :id', {
          replacements: { token, id: user.id }
        });

        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
});

export default router;
