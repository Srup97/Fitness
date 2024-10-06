// src/components/SelectorModalidad.js
import React from 'react';

const SelectorModalidad = ({ modalidades, selectedModalidad, onChange }) => {
  return (
    <div className="flex justify-center mb-4">
      <select 
        value={selectedModalidad} 
        onChange={(e) => onChange(e.target.value)}
        className="p-3 m-4 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
      >
        <option value="">Selecciona una modalidad</option>
        {modalidades.map((modalidad) => (
          <option key={modalidad} value={modalidad}>{modalidad}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectorModalidad;
