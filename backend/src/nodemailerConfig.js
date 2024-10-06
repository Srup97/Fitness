// nodemailerConfig.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // o el servicio que estés usando
  auth: {
    user: 'tu_correo@gmail.com', // tu correo electrónico
    pass: 'tu_contraseña', // tu contraseña de correo electrónico
  },
});

export default transporter;
