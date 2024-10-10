import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const MembershipInfo = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [userData, setUserData] = useState(null);
  const [membershipData, setMembershipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`http://localhost:5000/api/membresias/getMembresiaUser/${userId}`);
        console.log(response.data);
        if (response.data.length > 0) {
          setMembershipData(response.data[0]); // Assuming you want the first membership
        } else {
          // Fetch user data if no membership is found
          await fetchUserData();
        }
      } catch (error) {
        setError('Error fetching memberships data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/usuario/datos_usuario/${userId}`);
        setUserData(response.data);
        setError('No se encontró una membresía activa.');
      } catch (error) {
        setError('Error fetching user data');
        console.error(error);
      }
    };

    fetchMembershipData();
  }, [userId]);

  const calculateDaysLeft = (endDate) => {
    const today = dayjs();
    const end = dayjs(endDate);
    const diff = end.diff(today, 'day');
    return diff >= 0 ? `${diff} días restantes` : `Atrasado por ${Math.abs(diff)} días`;
  };

  const handlePayClick = () => {
    navigate(`/pagomembresia`, {
      state: {
        membershipData,
        selectedUser: { id: userId, username: membershipData.username, nombre_completo: membershipData.nombre_completo }
      }
    });
  };

  const handleNewMembershipClick = () => {
    navigate(`/Membresias`, {
      state: {
        selectedUser: {
          id: userId,
          username: userData ? userData.username : '',
          nombre_completo: userData ? `${userData.persona.nombre} ${userData.persona.apellido}` : ''
        }
      }
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen pt-20">
        <div className="bg-red-100 text-red-800 border border-red-800 rounded p-4 max-w-md mx-auto text-center">
          {error}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          onClick={handleNewMembershipClick}
        >
          Adquirir Membresía
        </button>
      </div>
    );
  }

  if (!membershipData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen pt-20">
        <div className="bg-red-100 text-red-800 border border-red-800 rounded p-2 max-w-md mx-auto text-center">
          Error: No se encontró una membresía activa.
        </div>
        <button
          className="mt-4 px-4 py-2 my-6 bg-red-600 hover:bg-red-700 text-white rounded"
          onClick={handleNewMembershipClick}
        >
          Adquirir Membresía
        </button>
      </div>
    );
  }

  const daysLeftMessage = calculateDaysLeft(membershipData.end_date);
  const formattedEndDate = dayjs(membershipData.end_date).format('YYYY-MM-DD');
  let statusClass;
  let isExpired = false;

  if (membershipData.status === 'activa') {
    statusClass = 'bg-green-500 text-white px-2 py-1 rounded';
  } else if (membershipData.status === 'expirada') {
    statusClass = 'bg-red-500 text-white px-2 py-1 rounded';
    isExpired = true;
  } else if (membershipData.status === 'inactiva') {
    statusClass = 'bg-gray-500 text-white px-2 py-1 rounded';
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">Información sobre la Membresía de {membershipData.nombre_completo}</h2>
        <h3 className="text-xl font-medium text-blue-600 mb-2">Membresia tipo: {membershipData.nombre}</h3>
        <p className="text-lg mb-2"><strong>Incluye:</strong> {membershipData.descripcion}</p>
        <p className="text-lg mb-2"><strong>Modalidad:</strong> {membershipData.modalidad}</p>
        <p className="text-lg mb-2"><strong>Precio:</strong> ${membershipData.costo}</p>
        <p className="text-lg mb-2"><strong>Fecha de Pago:</strong> {formattedEndDate}</p>
        <p className="text-lg mb-2"><strong>Días Restantes:</strong> {daysLeftMessage}</p>
        <p className="text-lg mb-2"><strong>Estado de la membresía:</strong> <span className={statusClass}>{membershipData.status.toUpperCase()}</span></p>
        <div className="flex justify-center mt-4">
          <button
            className={`px-4 py-2 rounded ${isExpired ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'}`}
            onClick={handlePayClick}
            disabled={!isExpired}
          >
            Pagar
          </button>
          <button
            className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            onClick={() => alert('Función de pago aún no implementada.')}
          >
            Cancelar Membresía
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipInfo;
