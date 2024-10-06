import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const SelectUserWithoutMembership = () => {
  const { membershipId } = useParams();
  const [users, setUsers] = useState([]);
  const [membershipData, setMembershipData] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { membership } = location.state || {};

  useEffect(() => {
    const fetchUsersWithoutMembership = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/membresias/sin_membresia');
        setUsers(response.data);
        setFilteredUsers(response.data);

        if (membershipId) {
          const response2 = await axios.get(`http://localhost:5000/api/membresias/datos_membresia/${membershipId}`);
          setMembershipData(response2.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsersWithoutMembership();
  }, [membershipId]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  }, [searchTerm, users]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleConfirmPayment = () => {
    if (selectedUser && membershipData) {
      navigate(`/pagomembresia`, {
        state: {
          membershipData,
          selectedUser
        }
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Select User for Membership: {membership?.nombre}</h2>
        <input
          type="text"
          placeholder="Buscar usuario"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <ul className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className={`p-2 cursor-pointer ${selectedUser?.id === user.id ? 'bg-blue-500 text-white' : 'bg-white text-black'} hover:bg-blue-100`}
            >
              {user.nombre_completo}
            </li>
          ))}
        </ul>
        <button
          onClick={handleConfirmPayment}
          disabled={!selectedUser}
          className={`mt-4 w-full py-2 rounded ${selectedUser ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default SelectUserWithoutMembership;
