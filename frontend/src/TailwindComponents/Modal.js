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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white flex p-4 rounded-lg relative">
        {children}
        <div className="close-button-container rounded mx-0">
          <CloseButton onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
