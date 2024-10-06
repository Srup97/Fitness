import React from 'react';
import '../CSS/Unauthorized.css';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1>No estás autorizado para ver esta página</h1>
      <p>Lo siento, no tienes permiso para acceder a esta sección.</p>
    </div>
  );
};

export default Unauthorized;
