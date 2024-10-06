import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.js';
import Register from './components/Register.js';
import UserData from './components/UserData.js';
import Login from './components/Login.js';
import Navbar from './components/Navbar.js';
import Unauthorized from './components/Unauthorized.js';
import { AuthProvider } from './AuthContext.js';
import PrivateRoute from './PrivateRoute.js';
import ChangePassword from './components/ChangePassword.js';
import ForgotPassword from './components/ForgotPassword.js';
import Memberships from './components/Memberships.js';
import UserMembership from './components/UserMembership.js';
import Billing from './components/PayMembership.js';
import MembershipInfo from './components/MembershipInfo.js';
import MembershipBill from './components/MembershipBill.js';
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/Membresias" element={<Memberships />} />
          <Route path="/userMembresia/:membershipId" element={<UserMembership />} />
          <Route path="/pagomembresia" element={<Billing />} />
          <Route path="/infoMembresia" element={<MembershipInfo />} />
          <Route path="/facturas/:tipo" element={<MembershipBill />} />
          <Route
            path="/usuarios"
            element={
              <PrivateRoute requiredRole="admin">
                <UserData />
              </PrivateRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
