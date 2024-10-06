import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import FacturaModal from './modals/FacturaModal.js';

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { tipo } = useParams();

  const fetchFacturas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/factura/getfacturas', {
        params: { username: searchTerm, tipo }
      });
      console.log(response.data);
      setFacturas(response.data);
    } catch (error) {
      console.error('Error fetching facturas:', error);
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, [tipo, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const openModal = (factura) => {
    setSelectedFactura(factura);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedFactura(null);
    setModalIsOpen(false);
  };

  const handlePaymentComplete = (facturaId) => {
    setFacturas(facturas.map(factura => 
      factura.nofactura === facturaId 
        ? { ...factura, estado_pago: 'pagado' } 
        : factura
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Facturas de {tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre de usuario"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {facturas.map((factura) => (
            <div 
              key={factura.nofactura} 
              className={`p-4 rounded-md shadow-md bg-white hover:shadow-lg transition cursor-pointer ${factura.estado_pago === 'pagado' ? 'bg-green-100' : 'bg-red-100'}`} 
              onClick={() => openModal(factura)}
            >
              <p className="text-gray-800"><strong>NO.:</strong> {factura.nofactura}</p>
              <p className="text-gray-800"><strong>Usuario:</strong> {factura.username}</p>
              <p className="text-gray-800"><strong>Tipo:</strong> {factura.nombre_membresia}</p>
              <p className="text-gray-800"><strong>Monto:</strong> ${factura.monto_factura}</p>
              <p className="text-gray-800"><strong>Fecha:</strong> {new Date(factura.fecha_emision).toLocaleDateString()}</p>
              <p className="text-gray-800"><strong>Estado:</strong> {factura.estado_pago}</p>
            </div>
          ))}
        </div>
        <FacturaModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          factura={selectedFactura}
          onPaymentComplete={handlePaymentComplete}
        />
      </div>
    </div>
  );
};

export default Facturas;
