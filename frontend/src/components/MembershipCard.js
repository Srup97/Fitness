import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/MembershipCard.css';
import { AuthContext } from '../AuthContext.js';
import Tarjeta from '../TailwindComponents/Card.js';

const MembershipCard = ({ membership }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsersWithoutMembership = async () => {
      try {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`http://localhost:5000/api/usuario/getUserdata/${user.username}`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsersWithoutMembership();
  }, [membership.id, user.username]);

  const handlePayClick = () => {
    if (user.role === 'user') {
      navigate(`/pagomembresia`, {
        state: {
          membershipData: membership,
          selectedUser: users[0] // Cambia esto si necesitas pasar un usuario específico
        }
      });
    } else if (user.role === 'admin') {
      navigate(`/userMembresia/${membership.id}`);
    }
  };

  return (
    <Tarjeta
      imageSrc="../img/Nexus-Sports-Nutrition-Logo-Booty-N-Buff.png"
      title={membership.nombre}
      description={`${membership.descripcion}`}
      precio = {`$${membership.costo}`}
      buttonText="Comprar"
      onButtonClick={handlePayClick}
    />
  );
};

export default MembershipCard;
