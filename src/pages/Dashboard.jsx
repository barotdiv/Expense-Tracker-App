import React from 'react';
import App from '../App.jsx';
import { removeToken } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const navigate = useNavigate();
  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };
  return (
    <div>
      <button style={{float:'right'}} onClick={handleLogout}>Logout</button>
      <App />
    </div>
  );
}
