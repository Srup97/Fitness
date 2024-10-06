// authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp - currentTime < 600) { // Menos de 10 minutos
      const newToken = jwt.sign({ user: req.user }, secret, { expiresIn: '1h' });
      res.setHeader('Authorization', `Bearer ${newToken}`);
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid or has expired' });
  }
};

export default authMiddleware;
