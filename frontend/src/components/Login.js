import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext.js';
import PasswordInput from '../TailwindComponents/PasswordInput.js';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        login(data.token);
        navigate('/');
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage('Error en el servidor');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }
    handleLogin(formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">Inicio de Sesión</h2>
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Nombre de Usuario</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-6">
          <PasswordInput
            label="Contraseña"
            value={formData.password}
            onChange={(e) => handleChange({ target: { name: 'password', value: e.target.value } })}
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 transition duration-200">Iniciar Sesión</button>
        <div className="text-center mt-4">
          <a href="/forgotpassword" className="text-sm text-blue-500 hover:underline">¿Olvidaste tu contraseña?</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
