import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import PasswordInput from '../TailwindComponents/PasswordInput.js'; // Asegúrate de importar el nuevo componente

const ChangePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { username } = location.state;

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/usuario/change-password', {
        username,
        oldPassword,
        newPassword,
      });

      if (response.status === 200) {
        setSuccess('Contraseña cambiada correctamente');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
      } else {
        setError('Error al cambiar la contraseña');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Error en el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Cambiar Contraseña</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form className="space-y-4">
          <PasswordInput
            label="Contraseña Antigua:"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <PasswordInput
            label="Nueva Contraseña:"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <PasswordInput
            label="Confirmar Nueva Contraseña:"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handleChangePassword}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cambiar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
