import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/11379905_1637023823182711_105138283_a (1).jpg';
import { AuthContext } from '../AuthContext.js';
import axios from 'axios';

function Navbar() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeMembership, setActiveMembership] = useState(null);

  useEffect(() => {
    const fetchActiveMembership = async () => {
      if (user && user.role === 'user') {
        try {
          const response = await axios.get(`http://localhost:5000/api/membresias/getStatusMembership/${user.id}`);
          setActiveMembership(response.data[0]);
        } catch (error) {
          console.error('Error fetching active membership:', error);
        }
      }
    };

    fetchActiveMembership();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirige a la página de usuario
  };

  const handleMembershipClick = () => {
    if (activeMembership && (activeMembership.status === 'activa' || activeMembership.status === 'expirada')) {
      navigate('/infoMembresia', { state: { userId: user.id } });
    } else {
      navigate('/membresias');
    }
  };

  const handleFacturaClick = (tipo) => {
    navigate(`/facturas/${tipo}`);
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Nexus Sports Nutrition Logo" className="h-16 w-auto" />
          </Link>
          <Link to="/">
          <span className="text-white text-2xl font-bold ml-4">Nexus Sports Nutrition</span>
          </Link>
        </div>
        <ul className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              {user.role === 'admin' && (
                <>
                  <li>
                    <Link to="/usuarios" className="text-white hover:bg-orange-500 hover:text-white py-2 px-4 rounded transition duration-300">Usuarios</Link>
                  </li>
                  <li className="relative group p-3">
                    <button className="text-white hover:bg-orange-500 hover:text-white py-2 px-4 rounded transition duration-300">Facturas</button>
                    <div className="absolute hidden group-hover:block bg-white text-black py-2 mt-2 rounded shadow-lg">
                      <button onClick={() => handleFacturaClick('membresia')} className="block px-4 py-2 hover:bg-orange-500 hover:text-white w-full text-left">Membresía</button>
                      <button onClick={() => handleFacturaClick('producto')} className="block px-4 py-2 hover:bg-orange-500 hover:text-white w-full text-left">Producto</button>
                    </div>
                  </li>
                </>
              )}
              <li>
                <button onClick={handleMembershipClick} className="text-white hover:bg-orange-500 hover:text-white py-2 px-4 rounded transition duration-300">Membresias</button>
              </li>
              <li>
                <button onClick={handleLogout} className="text-white hover:bg-red-500 hover:text-white py-2 px-4 rounded transition duration-300">Logout</button>
              </li>
              <li>
                <span className="text-white font-semibold">{user.username} ({user.role})</span>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-white hover:bg-orange-500 hover:text-white py-2 px-4 rounded transition duration-300">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-white hover:bg-orange-500 hover:text-white py-2 px-4 rounded transition duration-300">Registrarse</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
