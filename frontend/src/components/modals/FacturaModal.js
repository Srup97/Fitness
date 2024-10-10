import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../TailwindComponents/Modal.js';
import axios from 'axios';
import '../../CSS/FacturaModal.css';

const FacturaModal = ({ isOpen, onRequestClose, factura, onPaymentComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  if (!factura) return null;

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.put(`http://localhost:5000/api/factura/confirmar_factura/${factura.nofactura}`, {
        id: factura.id_factura,
      });
      console.log(response.data);
      onPaymentComplete(factura.nofactura);
      onRequestClose();
    } catch (error) {
      console.error(error);
      setError('Error al procesar el pago. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToMembership = () => {
    console.log(factura.username);
    navigate('/infoMembresia', { state: { userId: factura.user_id } });
  };

  return (
    <Modal isOpen={isOpen} onClose={onRequestClose}>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Detalle de Factura</h2>
        <div className="space-y-2">
          <p><strong>NO.:</strong> {factura.nofactura}</p>
          <p><strong>Usuario:</strong> {factura.username}</p>
          <p><strong>Nombre Completo:</strong> {factura.nombre_completo}</p>
          <p><strong>Tipo:</strong> {factura.nombre_membresia}</p>
          <p><strong>Descripción:</strong> {factura.descripcion}</p>
          <p><strong>Nivel:</strong> {factura.nivel}</p>
          <p><strong>Modalidad:</strong> {factura.modalidad}</p>
          <p><strong>Monto:</strong> ${factura.monto_factura}</p>
          <p><strong>Fecha:</strong> {new Date(factura.fecha_emision).toLocaleDateString()}</p>
          <p><strong>Estado:</strong> {factura.estado_pago}</p>
          <p><strong>Total Efectivo:</strong> ${factura.total_efectivo}</p>
          <p><strong>Devuelta:</strong> ${factura.devuelta}</p>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="mt-6 flex space-x-2">
          {factura.estado_pago === 'pendiente' && (
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading ? 'Procesando...' : 'Pagar'}
            </button>
          )}
          <button
            onClick={() => {/* Imprimir factura */}}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Imprimir
          </button>
          <button
            onClick={navigateToMembership}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Ver Membresía
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FacturaModal;
