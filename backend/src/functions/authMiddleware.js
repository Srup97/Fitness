// authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sequelize from '../db.js'; // Asegúrate de importar tu instancia de Sequelize

dotenv.config();
const secret = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;

    const [results] = await sequelize.query('SELECT last_token, last_activity FROM usuario WHERE id = :id', {
      replacements: { id: decoded.user.id }
    });

    if (results.length === 0 || results[0].last_token !== token) {
      return res.status(401).json({ message: 'Sesión no válida o token ha expirado' });
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const lastActivityTime = Math.floor(new Date(results[0].last_activity).getTime() / 1000);
    
    if (currentTime - lastActivityTime > 3 * 3600) { // Inactivo por más de 3 horas
      return res.status(401).json({ message: 'Sesión expirada por inactividad' });
    }

    // Actualiza la última actividad
    await sequelize.query('UPDATE usuario SET last_activity = NOW() WHERE id = :id', {
      replacements: { id: decoded.user.id }
    });

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid or has expired' });
  }
};

export default authMiddleware;
