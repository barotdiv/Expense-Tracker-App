import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authService.register(username, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
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
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join SpendWise to start tracking your expenses</p>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                className="form-input"
                placeholder="john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

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
              <label htmlFor="password" className="form-label">Password (Min. 6 characters)</label>
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

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-submit" style={{ marginTop: '0.5rem' }} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner">⏳</span> Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?
            <Link to="/login" className="auth-link">Log In</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
