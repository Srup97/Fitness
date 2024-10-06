// ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage('Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.');
    } catch (error) {
      console.error('Error enviando el correo de recuperación:', error);
      setMessage('Hubo un error enviando el correo de recuperación. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="forgot-password-form">
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="Introduce tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Enviar</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
