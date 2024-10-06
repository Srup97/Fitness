import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        // Verificar si el token está expirado
        if (decoded.exp < currentTime) {
          logout(); // Cerrar sesión si el token ha expirado
        } else {
          setIsAuthenticated(true);
          setUser(decoded.user);
          setRole(decoded.user.role);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        logout(); // Cerrar sesión en caso de error al decodificar
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setIsAuthenticated(true);
      setUser(decoded.user);
      setRole(decoded.user.role);
      localStorage.setItem('token', token); // Guardar el token
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
