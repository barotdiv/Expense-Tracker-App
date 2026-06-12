import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Decorative moving blur backgrounds */}
      <div className="gradient-bg" aria-hidden="true">
        <div className="gradient-blob-1"></div>
        <div className="gradient-blob-2"></div>
      </div>

      <div className="auth-container">
        <div className="card auth-card animate-slideup">
          <div className="auth-header-section">
            <div className="logo-icon" style={{ margin: '0 auto 1rem auto' }} aria-hidden="true">
              <span>💸</span>
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Log in to manage your budget and track expenses</p>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-submit" style={{ marginTop: '0.5rem' }} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner">⏳</span> Logging in...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?
            <Link to="/register" className="auth-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
