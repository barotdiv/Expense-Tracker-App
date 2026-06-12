import React, { useState } from 'react';
import { login, setToken } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.token) {
      setToken(res.token);
      navigate('/dashboard');
    } else {
      alert(res.message || 'Login failed');
    }
  };

  return (
    <div style={{maxWidth:400, margin:'2rem auto'}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}
