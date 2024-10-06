// src/components/Tarjeta.js
import React from 'react';

const Tarjeta = ({ imageSrc, title, description, precio, buttonText, onButtonClick }) => {
  return (
    <div className="flex flex-col rounded-2xl w-72 bg-white shadow-xl">
      <figure className="flex justify-center items-center rounded-2xl">
        <img src={imageSrc} alt={title} className="rounded-t-3xl" />
      </figure>
      <div className="flex flex-col p-7">
        <div className="text-2xl font-bold text-gray-800 pb-6">{title}</div>
        <div className="text-lg text-gray-800">{description}</div>
        <div className="mt-6 text-lg text-gray-800 justify-center items-center flex"><strong>RD{precio}</strong></div>
        <div className="flex justify-end pt-6">
          <button 
            className="bg-orange-500 text-white w-full font-bold text-base p-3 rounded-lg hover:bg-orange-800 active:scale-95 transition-transform transform" 
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tarjeta;
