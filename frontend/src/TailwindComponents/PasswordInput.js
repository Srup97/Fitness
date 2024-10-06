import React, { useState } from 'react';

const PasswordInput = ({ label, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-orange-500 text-sm leading-5"
        >
          {showPassword ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
