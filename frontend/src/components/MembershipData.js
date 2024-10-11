import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../TailwindComponents/Modal.js';
import { compareMemberships } from '../Functions/MembershipUtils.js';
import { useNavigate } from 'react-router-dom';

const MembershipList = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('http://localhost:5000/api/membresias/datosMembresia');
        setMemberships(response.data);
      } catch (error) {
        setError('Error fetching memberships');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  const openModal = (membership) => {
    setSelectedMembership(membership);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedMembership(null);
  };

  const filteredMemberships = memberships.filter(user =>
    user.persona.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.membresias.some(membership => membership.datosMembresia.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedMemberships = filteredMemberships.sort((a, b) => {
    const membershipA = a.membresias[0];
    const membershipB = b.membresias[0];
    return compareMemberships(membershipA, membershipB, sortCriteria);
  });

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen">{error}</div>;

  const navigateToMembership = (userId) => {
    navigate('/infoMembresia', { state: { userId: userId } });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-center bg-orange-700 mb-4">Membresías</h2>
      <input
        type="text"
        placeholder="Buscar por nombre, username o tipo de membresía..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border border-gray-300 rounded w-full mb-4"
      />
      <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)} className="p-2 border border-gray-300 rounded w-full mb-4">
        <option value="">Ordenar por...</option>
        <option value="estatus">Estatus</option>
        <option value="tipo">Tipo de Membresía</option>
        <option value="precioAsc">Precio (menor a mayor)</option>
        <option value="precioDesc">Precio (mayor a menor)</option>
        <option value="fechaInicioAsc">Fecha de Inicio (más antigua a más reciente)</option>
        <option value="fechaInicioDesc">Fecha de Inicio (más reciente a más antigua)</option>
        <option value="fechaFinAsc">Fecha de Fin (más antigua a más reciente)</option>
        <option value="fechaFinDesc">Fecha de Fin (más reciente a más antigua)</option>
      </select>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID Usuario</th>
              <th className="py-2 px-4 border-b">Nombre Usuario</th>
              <th className="py-2 px-4 border-b">Tipo Membresía</th>
              <th className="py-2 px-4 border-b">Fecha Inicio</th>
              <th className="py-2 px-4 border-b">Fecha Fin</th>
              <th className="py-2 px-4 border-b">Precio</th>
              <th className="py-2 px-4 border-b">Estado</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedMemberships.map(user =>
              user.membresias.map(membership => (
                <tr key={membership.id}>
                  <td className="py-2 px-4 border-b">{user.id}</td>
                  <td className="py-2 px-4 border-b">{`${user.persona.nombre} ${user.persona.apellido}`}</td>
                  <td className="py-2 px-4 border-b">{membership.datosMembresia.nombre}</td>
                  <td className="py-2 px-4 border-b">{new Date(membership.start_date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{new Date(membership.end_date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{membership.datosMembresia.costo}</td>
                  <td className="py-2 px-4 border-b">{membership.status}</td>
                  <td className="py-2 px-4 border-b">
                  <button onClick={() => openModal(membership)} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition ml-2">Pagar</button>
                    <button onClick={() => openModal(membership)} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition ml-2">Detalles</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalIsOpen && selectedMembership && (
  <Modal onClose={closeModal}>
    <h2 className="text-xl font-bold mb-6 text-center">Detalles de la Membresía</h2>
    <div className="mx-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className=" justify-between">
          <p className="font-semibold"><strong>Nombre:</strong></p>
          <p>{selectedMembership.datosMembresia.nombre}</p>
        </div>
        <div className=" justify-between">
          <p className="font-semibold"><strong>Fecha de Inicio:</strong></p>
          <p>{new Date(selectedMembership.start_date).toLocaleDateString()}</p>
        </div>
        <div className=" justify-between">
          <p className="font-semibold"><strong>Fecha de Fin:</strong></p>
          <p>{new Date(selectedMembership.end_date).toLocaleDateString()}</p>
        </div>
        <div className="fex justify-between">
          <p className="font-semibold"><strong>Precio:</strong></p>
          <p>{selectedMembership.datosMembresia.costo}</p>
        </div>
        <div className=" justify-between">
          <p className="font-semibold"><strong>Estado:</strong></p>
          <p>{selectedMembership.status}</p>
        </div>
        <div className="block m-6 p-2">
        <p className="font-semibold"><strong>Acciones:</strong></p>
        <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition ml-2">Ver membresia</button>
        </div>
      </div>
    </div>
  </Modal>
)}
    </div>
  );
};

export default MembershipList;
