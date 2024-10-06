// forgotPasswordRoute.js
import express from 'express';
import transporter from '../nodemailerConfig.js';
import sequelize from "../db.js"; // Asegúrate de importar tu instancia de sequelize correctamente

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await sequelize.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'El correo electrónico no está registrado' });
    }

    // Aquí deberías generar un token único y guardarlo en la base de datos junto con una marca de tiempo de expiración

    const mailOptions = {
      from: 'tu_correo@gmail.com',
      to: email,
      subject: 'Recuperación de contraseña',
      text: 'Haz clic en el siguiente enlace para restablecer tu contraseña: http://localhost:3000/reset-password', // Deberías incluir el token en la URL
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error al enviar el correo electrónico' });
      }
      res.status(200).json({ message: 'Correo de recuperación enviado con éxito' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

export default router;
