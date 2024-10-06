import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../CSS/MembershipInfo.css';
import axios from 'axios';
import dayjs from 'dayjs';

const MembershipInfo = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [membershipData, setMembershipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/membresias/getMembresiaUser/${userId}`);
        if (response.data.length > 0) {
          setMembershipData(response.data[0]); // Assuming you want the first membership
        } else {
          setError('No se encontró una membresía activa.');
        }
      } catch (error) {
        setError('Error fetching memberships data');
        console.error(error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!membershipData) {
    return <div className="info-error-message ">Error: No se encontró una membresía activa.</div>;
  }

  const daysLeftMessage = calculateDaysLeft(membershipData.end_date);
  let statusClass;
  let isExpired = false;

  if (membershipData.status === 'activa') {
    statusClass = 'status-active';
  } else if (membershipData.status === 'expirada') {
    statusClass = 'status-expired';
    isExpired = true;
  } else if (membershipData.status === 'inactiva') {
    statusClass = 'status-disabled';
  }

  return (
    <div className="membership-info-page">
      <div key={membershipData.id} className="membership-info">
        <h2>Información sobre la Membresía de {membershipData.nombre_completo}</h2>
        <h3>Membresia tipo: {membershipData.nombre}</h3>
        <p><strong>Incluye: </strong> {membershipData.descripcion}</p>
        <p><strong>Precio:</strong> ${membershipData.costo}</p>
        <p><strong>Fecha de Pago:</strong> {membershipData.end_date}</p>
        <p><strong>Días Restantes:</strong> {daysLeftMessage}</p>
        <p><strong>Estado de la membresía:</strong> <span className={`status-label ${statusClass}`}>{membershipData.status}</span></p>
        <div className='info-button-content'>
          <button
            className={`info-button-pagar ${isExpired ? 'status-pagar-active' : 'status-pagar-disabled'}`}
            onClick={handlePayClick}
            disabled={!isExpired}
          >
            Pagar
          </button>
          <button className='info-button-cancelar' onClick={() => alert('Función de pago aún no implementada.')}>Cancelar Membresia</button>
        </div>
      </div>
    </div>
  );
};

export default MembershipInfo;
