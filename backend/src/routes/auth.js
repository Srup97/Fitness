import bcrypt from 'bcryptjs';
import router from './usuario.js';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import sequelize from '../db.js';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET; // Obtén la clave secreta desde las variables de entorno

// Endpoint de login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Log de datos de entrada
  console.log('Datos de entrada:', req.body);

  try {
    const [results] = await sequelize.query('SELECT * FROM usuario WHERE username = :username', {
      replacements: { username }
    });

    // Log de resultados de la consulta
    console.log('Resultados de la consulta:', results);

    if (results.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];
    console.log('Username en base de datos:', user.username);
    console.log('Password hasheada en base de datos:', user.password);

    // Verificar la coincidencia de contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Contraseña ingresada:', password);
    console.log('Coincidencia de contraseña:', isMatch);

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

    console.log('Descripción del rol:', role_descripcion[0].role_description);

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: role_descripcion[0].role_description  // Incluye el rol en el payload
      }
    };

    sign(
      payload,
      secret, // Usa la clave secreta desde las variables de entorno
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('Error al generar el token:', err); // Log de error al generar el token
          throw err;
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Error en el servidor:', err.message); // Log de errores en el servidor
    res.status(500).send('Error en el servidor');
  }
});

export default router;
