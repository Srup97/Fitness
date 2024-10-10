import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../CSS/MembershipCard.css';
import { AuthContext } from '../AuthContext.js';
import Tarjeta from '../TailwindComponents/Card.js';
import SelectorModalidad from '../TailwindComponents/SelectorModalidad.js';

const Membership = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedUser } = location.state || {}; // Modificado para recibir los datos del usuario
  const [memberships, setMemberships] = useState([]);
  const [selectedModalidad, setSelectedModalidad] = useState('');
  const { user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        console.log(selectedUser);
        const response = await axios.get('http://localhost:5000/api/membresias/datos_membresia');
        setMemberships(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMemberships();
  }, []);

  const handlePayClick = (membership) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user.role === 'user') {
      navigate(`/pagomembresia`, {
        state: {
          membershipData: membership,
          selectedUser: user,
        },
      });
    } else if (user.role === 'admin') {
      navigate(`/pagomembresia`, {
        state: {
          membershipData: membership,
          selectedUser: selectedUser, // Usar los datos del usuario recibidos
        },
      });
    }
  };

  const modalidades = [...new Set(memberships.map((membership) => membership.modalidad))];

  const filteredMemberships = selectedModalidad
    ? memberships.filter((membership) => membership.modalidad === selectedModalidad)
    : memberships;

  return (
    <div className="flex flex-col items-center">
      <SelectorModalidad
        modalidades={modalidades}
        selectedModalidad={selectedModalidad}
        onChange={setSelectedModalidad}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 justify-center w-full max-w-6xl">
        {filteredMemberships.map((membership) => (
          <Tarjeta
            key={membership.id}
            imageSrc="https://tailwind-generator.b-cdn.net/images/card-generator/tailwind-card-generator-card-preview.png"
            title={membership.nombre}
            description={`${membership.descripcion}`}
            precio={`$${membership.costo}`}
            buttonText="Comprar"
            onButtonClick={() => handlePayClick(membership)}
          />
        ))}
      </div>
    </div>
  );
};

export default Membership;
