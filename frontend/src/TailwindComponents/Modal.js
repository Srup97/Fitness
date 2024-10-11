import React from 'react';
import CloseButton from './CloseButton.js'; // Asegúrate de que la ruta sea correcta

const Modal = ({ onClose, children }) => {
  const handleBackgroundClick = (e) => {
    // Si el objetivo del clic es el contenedor de fondo, cierra el modal
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" // Añadido z-50 para asegurar que el modal esté por encima
      onClick={handleBackgroundClick}
    >
      <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-lg relative">
        <div className="absolute top-4 right-4">
          <CloseButton onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
