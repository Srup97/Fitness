import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext.js';

const Billing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { membershipData, selectedUser } = location.state || {};
  const [amount, setAmount] = useState('');
  const [refund, setRefund] = useState(0);
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const inputRef = useRef(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (amount && membershipData) {
      const calculatedRefund = parseFloat(amount) - parseFloat(membershipData.costo);
      setRefund(calculatedRefund >= 0 ? calculatedRefund : 0);
      setIsPaymentEnabled(paymentMethod !== 'cash' || parseFloat(amount) >= parseFloat(membershipData.costo));
    } else {
      setRefund(0);
      setIsPaymentEnabled(paymentMethod !== 'cash');
    }
  }, [amount, membershipData, paymentMethod]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handlePayment = async () => {
    try {
      await axios.post('http://localhost:5000/api/membresias/pago_membresia', {
        membershipId: membershipData.id,
        tipo_factura: 'membresia',
        userId: user.id,
        devuelta: refund.toFixed(2),
        selectedUser: selectedUser.id
      });
      alert('Pago realizado con éxito');
      navigate('/'); // Redirige a la página principal u otra página
    } catch (error) {
      alert('Error al realizar el pago.');
    }
  };

  if (!membershipData || !selectedUser) {
    return <div>Error: No se encontraron los datos necesarios para la facturación.</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-5 mt-5 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Facturación de Membresía</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="text-xl font-semibold mb-2">Datos de Membresía</h3>
        <p><strong>Nombre de la Membresía:</strong> {membershipData.nombre}</p>
        <p><strong>Descripción:</strong> {membershipData.descripcion}</p>
        <p><strong>Precio:</strong> ${membershipData.costo}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="text-xl font-semibold mb-2">Datos del Usuario</h3>
        <p><strong>Nombre Completo:</strong> {selectedUser.nombre_completo}</p>
        <p><strong>Username:</strong> {selectedUser.username}</p>
      </div>
      <div className="mb-4">
        <label htmlFor="paymentMethod" className="block mb-2">Método de Pago:</label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Selecciona un método de pago</option>
          <option value="cash">Efectivo</option>
          <option value="visa">Visa</option>
          <option value="mastercard">MasterCard</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>
      {paymentMethod === 'cash' && (
        <>
          <div className="mb-4">
            <label htmlFor="amount" className="block mb-2">Monto a Pagar:</label>
            <input
              type="number"
              id="amount"
              ref={inputRef}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="text-green-600 font-bold">
            <p><strong>Devuelta:</strong> ${refund.toFixed(2)}</p>
          </div>
        </>
      )}
      {['visa', 'mastercard', 'paypal'].includes(paymentMethod) && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p><strong>Seleccionaste:</strong> {paymentMethod}</p>
          {/* Aquí puedes agregar campos adicionales específicos para el método de pago seleccionado */}
        </div>
      )}
      <div className="flex justify-between">
        <button
          onClick={handlePayment}
          className={`px-4 py-2 rounded-lg text-white ${isPaymentEnabled ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          disabled={!isPaymentEnabled}
        >
          Pagar
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-700 text-white"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default Billing;
