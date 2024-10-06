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
        const response = await axios.get('http://localhost:5000/api/usuario/getAllUser');
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

  const navigateToMembership = (username) => {
    navigate('/infoMembresia', { state: { userId: username } });
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-3xl font-bold mr-4'>Usuarios</h1>
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
        placeholder="Buscar por nombre, usuario, género, DNI, teléfono o email"
        value={searchTerm}
        onChange={handleSearchChange}
        className="border border-gray-300 rounded p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">Nombre</th>
            <th className="py-2 px-4 text-left">Usuario</th>
            <th className="py-2 px-4 text-left">Estado</th>
            <th className="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className={`hover:bg-gray-100 ${user.status ? "bg-white" : "bg-red-100"}`}>
              <td className="py-2 px-4">{user.nombre} {user.apellido}</td>
              <td className="py-2 px-4">{user.username}</td>
              <td className="py-2 px-4">{user.status ? "Activo" : "Inactivo"}</td>
              <td className="py-2 px-4 space-x-2">
                <button onClick={() => openModal(user)} className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition">Ver detalles</button>
                <button onClick={() => navigateToChangePassword(user.username)} className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition">Cambiar Contraseña</button>
                <button onClick={() => navigateToMembership(user.id)} className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition">Ver Membresía</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalIsOpen && (
        <Modal onClose={closeModal}>
          {selectedUser && (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Detalles del Usuario</h2>
              <p><strong>Nombre:</strong> {selectedUser.nombre} {selectedUser.apellido}</p>
              <p><strong>Fecha de Nacimiento:</strong> {selectedUser.fecha_nacimiento}</p>
              <p><strong>Teléfono:</strong> {selectedUser.telefono_numero}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Dirección:</strong> {selectedUser.calle} en {selectedUser.ciudad}</p>
              <p><strong>Estado:</strong> {selectedUser.status ? "Activo" : "Inactivo"}</p>
              <button onClick={() => handleStatusChange(selectedUser)} className="bg-blue-500 text-white mt-4 py-2 px-4 rounded hover:bg-blue-600 transition">
                Cambiar Estado
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default UserData;
