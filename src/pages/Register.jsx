import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password);
    if (res.user) navigate('/login');
    else alert(res.message || 'Registration failed');
  };

  return (
    <div style={{maxWidth:400, margin:'2rem auto'}}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" required />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
