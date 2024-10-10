import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext.js';
import Modal from '../TailwindComponents/Modal.js'; // Importa el componente Modal personalizado
import { ChangeStatus } from '../Functions/ChangeStatus.js';
import { useNavigate } from 'react-router-dom';

const UserData = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('http://localhost:5000/api/usuario/membresia_user');
        if (Array.isArray(response.data)) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      Object.values(user).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalIsOpen(false);
  };

  const handleStatusChange = async (user) => {
    try {
      await ChangeStatus(user.id, user.status);
      const updatedUsers = users.map(u => u.id === user.id ? { ...u, status: user.status === 0 ? 1 : 0 } : u);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      closeModal();
    } catch (error) {
      setError('Error al cambiar el estado del usuario.');
    }
  };

  const handleCreateUser = () => {
    navigate('/register');
  };

  const navigateToChangePassword = (username) => {
    navigate('/changepassword', { state: { username } });
  };

  const navigateToMembership = (userId) => {
    navigate('/infoMembresia', { state: { userId: userId } });
  };

  if (loading) {
    return <div className="text-center text-lg">Cargando datos...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  if (users.length === 0) {
    return <div className="text-center">No hay datos de usuarios disponibles.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className='w-full max-w-6xl'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-3xl font-bold'>Usuarios</h1>
          {user.role === "admin" && (
            <button 
              onClick={handleCreateUser} 
              className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition"
            >
              Crear Usuario
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Buscar por nombre, usuario, o teléfono..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />

        <div className="bg-white shadow-md rounded overflow-hidden w-full">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200">Nombre</th>
                <th className="py-2 px-4 border-b border-gray-200">Usuario</th>
                <th className="py-2 px-4 border-b border-gray-200">Membresía</th>
                <th className="py-2 px-4 border-b border-gray-200">Estado</th>
                <th className="py-2 px-4 border-b border-gray-200">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="py-2 px-4 border-b border-gray-200">{user.persona.nombre} {user.persona.apellido}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{user.username}</td>
                 
                  <td className="py-2 px-4 border-b border-gray-200">
                    {user.membresias.length > 0 ? user.membresias.map((membresia) => (
                      <div key={membresia.id}>{membresia.datosMembresia.nombre} - {membresia.status}</div>
                    )) : 'Sin membresía'}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">{user.status ? 'Activo' : 'Inactivo'}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button 
                      onClick={() => openModal(user)} 
                      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition"
                    >
                      Detalles
                    </button>
                    <button 
                      onClick={() => navigateToChangePassword(user.username)} 
                      className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition ml-2"
                    >
                      Cambiar Contraseña
                    </button>
                    <button 
                      onClick={() => navigateToMembership(user.id)} 
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition ml-2"
                    >
                      Ver Membresía
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    {modalIsOpen && selectedUser && (
  <Modal isOpen={modalIsOpen} onClose={closeModal}>
    <div>
      <h2 className="text-xl font-bold mb-4">Detalles del Usuario</h2>
      <p><strong>Nombre:</strong> {selectedUser.persona.nombre} {selectedUser.persona.apellido}</p>
      <p><strong>Usuario:</strong> {selectedUser.username}</p>
      <p><strong>Teléfonos:</strong>
        <ul>
          {selectedUser.persona.telefonos.map((telefono) => (
            <li key={telefono.id}>{telefono.tipo}: {telefono.numero}</li>
          ))}
        </ul>
      </p>
      <p><strong>Dirección:</strong>
      <ul>
          {selectedUser.persona.direccion.map((direccion) => (
            <li key={direccion.id}>{`${direccion.calle} en ${direccion.ciudad} en ${direccion.pais}`}</li>
          ))}
        </ul>
      </p>
      <button 
        onClick={() => handleStatusChange(selectedUser)} 
        className="bg-red-500 text-white py-1 justify-center items-center flex px-3 rounded hover:bg-red-600 transition mt-4"
      >
        Cambiar Estado
      </button>
    </div>
  </Modal>
)}

    </div>
  );
};

export default UserData;
