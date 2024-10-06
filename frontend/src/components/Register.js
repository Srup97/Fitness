import React, { useState, useRef } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    genero: '',
    calle: '',
    ciudad: '',
    pais: '',
    telefono_tipo: '',
    telefono_numero: '',
    numero_identificacion: '',
    tipo_identificacion: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const formRefs = {
    nombre: useRef(null),
    apellido: useRef(null),
    fecha_nacimiento: useRef(null),
    genero: useRef(null),
    calle: useRef(null),
    ciudad: useRef(null),
    pais: useRef(null),
    telefono_tipo: useRef(null),
    telefono_numero: useRef(null),
    numero_identificacion: useRef(null),
    tipo_identificacion: useRef(null),
    email: useRef(null),
    username: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null)
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in formData) {
      if (formData[key] === '') {
        setErrorMessage(`El campo ${key} es obligatorio`);
        formRefs[key].current.focus();
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      formRefs.confirmPassword.current.focus();
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(formData.password, salt);

      const formDataWithHashedPassword = {
        ...formData,
        password: hashedPassword,
      };

      await axios.post('http://localhost:5000/api/usuario/registerUser', formDataWithHashedPassword);
      alert('Usuario registrado exitosamente');
      navigate('/user');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        console.error(error);
        alert('Hubo un error registrando al usuario');
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="bg-gray-100 rounded-lg shadow-lg max-w-lg mx-auto p-6 mt-10 font-sans" onSubmit={handleSubmit}>
      <h2 className="text-center text-2xl font-semibold text-gray-800">Registro de Usuario</h2>
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
      
      <div className="form-section mb-4">
        <h3 className="text-lg font-medium text-gray-700 border-b-2 border-blue-500 pb-2 mb-4">Datos Personales</h3>
        <div className="form-group mb-4">
          <label htmlFor="nombre" className="font-bold mb-2">Nombre</label>
          <input type="text" name="nombre" placeholder="Nombre" className="p-2 border rounded w-full" onChange={handleChange} ref={formRefs.nombre} />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="apellido" className="font-bold mb-2">Apellido</label>
          <input type="text" name="apellido" placeholder="Apellido" className="p-2 border rounded w-full" onChange={handleChange} ref={formRefs.apellido} />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="fecha_nacimiento" className="font-bold mb-2">Fecha de Nacimiento</label>
          <input type="date" name="fecha_nacimiento" className="p-2 border rounded w-full" onChange={handleChange} ref={formRefs.fecha_nacimiento} />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="genero" className="font-bold mb-2">Género</label>
          <select name="genero" className="p-2 border rounded w-full" onChange={handleChange} ref={formRefs.genero}>
            <option value="">Seleccione género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>

      <div className="form-section mb-4">
        <h3 className="text-lg font-medium text-gray-700 border-b-2 border-blue-500 pb-2 mb-4">Datos de Usuario</h3>
        <div className="form-group mb-4">
          <label htmlFor="username" className="font-bold mb-2">Nombre de Usuario</label>
          <input type="text" name="username" placeholder="Nombre de Usuario" className="p-2 border rounded w-full" onChange={handleChange} ref={formRefs.username} />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="email" className="font-bold mb-2">Email</label>
          <input type="email" name="email" placeholder="Email" className="p-2 border rounded w-full" onChange={handleChange} ref={formRefs.email} />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="password" className="font-bold mb-2">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              className="p-2 border rounded w-full"
              onChange={handleChange}
              ref={formRefs.password}
            />
          </div>
        </div>
        <div className="form-group mb-4">
          <label htmlFor="confirmPassword" className="font-bold mb-2">Confirmar Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirmar Contraseña"
              className="p-2 border rounded w-full"
              onChange={handleChange}
              ref={formRefs.confirmPassword}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-blue-500"
              onClick={toggleShowPassword}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>
      </div>

      <div className="form-section mb-4">
        <h3 className="text-lg font-medium text-gray-700 border-b-2 border-blue-500 pb-2 mb-4">Contactos</h3>
        <div className="form-group mb-4">
          <label htmlFor="telefono_tipo" className="font-bold mb-2">Tipo de Teléfono</label>
          <select name="telefono_tipo" className="p-2 border rounded w-full" onChange={handleChange} ref={formRefs.telefono_tipo}>
            <option value="">Seleccione tipo de teléfono</option>
            <option value="Casa">Casa</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Celular">Celular</option>
          </select>
        </div>
        <div className="form-group mb-4">
          <label htmlFor="telefono_numero" className="font-bold mb-2">Número de Teléfono</label>
          <input type="text" name="telefono_numero" placeholder="Número de Teléfono" className="p-2 border rounded w-full" onChange={handleChange} ref={formRefs.telefono_numero} />
        </div>
      </div>

      <div className="form-section mb-4">
        <h3 className="text-lg font-medium text-gray-700 border-b-2 border-blue-500 pb-2 mb-4">Dirección</h3>
        <div className="form-group mb-4">
          <label htmlFor="calle" className="font-bold mb-2">Calle</label>
          <input type="text" name="calle" placeholder="Calle" className="p-2 border rounded w-full" onChange={handleChange} ref={formRefs.calle} />
        </div>
        <div className="form-group mb-4">
            <label htmlFor="ciudad" className="font-bold mb-2">Ciudad</label>
            <input type="text" name="ciudad" placeholder="Ciudad" className="p-2 border rounded w-full" onChange={handleChange} ref={formRefs.ciudad} />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="pais" className="font-bold mb-2">País</label>
            <input type="text" name="pais" placeholder="País" className="p-2 border rounded w-full" onChange={handleChange} ref={formRefs.pais} />
          </div>
        </div>

        <div className="form-section mb-4">
          <h3 className="text-lg font-medium text-gray-700 border-b-2 border-blue-500 pb-2 mb-4">Identificación</h3>
          <div className="form-group mb-4">
            <label htmlFor="numero_identificacion" className="font-bold mb-2">Número de Identificación</label>
            <input type="text" name="numero_identificacion" placeholder="Número de Identificación" className="p-2 border rounded w-full" onChange={handleChange} ref={formRefs.numero_identificacion} />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="tipo_identificacion" className="font-bold mb-2">Tipo de Identificación</label>
            <select name="tipo_identificacion" className="p-2 border rounded w-full" onChange={handleChange} ref={formRefs.tipo_identificacion}>
              <option value="">Seleccione tipo de identificación</option>
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Licencia de Conducir">Licencia de Conducir</option>
            </select>
          </div>
        </div>

        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full">Registrar</button>
      </form>
    );
  };

  export default Register;
        
