// src/screens/LoginScreen.jsx
import React, { useState } from 'react';
import api from '../api'; 
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // 1) Login via api instance
      const { data } = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // 2) Store token & username
      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', data.token);
      storage.setItem('username', data.user.username);

      setMessage('Login successful! Please select your role...');
      setTimeout(() => setShowRoleModal(true), 500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelection = async (role) => {
    const storage = formData.rememberMe ? localStorage : sessionStorage;
    storage.setItem('role', role);

    if (role === 'provider') {
      try {
        // Interceptor will attach the token automatically
        await api.get('/providers/me');
        navigate('/provider/my-profile');
      } catch (err) {
        if (err.response?.status === 404) {
          navigate('/provider/profile');
        } else {
          setMessage('Could not verify provider profile. Please try again.');
        }
      }
    } else {
      navigate('/categories');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        {message && (
          <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label className="form-check-label">Remember Me</label>
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      {/* Role Modal */}
      {showRoleModal && (
        <div className="modal show fade" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title">Choose Your Role</h5>
                <button type="button" className="btn-close" onClick={() => setShowRoleModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <div className="row">
                  <div className="col-6">
                    <div
                      className="card p-3 mb-3 shadow-sm"
                      style={{ cursor: 'pointer', border: '2px solid #28a745', transition: 'transform 0.3s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      onClick={() => handleRoleSelection('provider')}
                    >
                      <div style={{ fontSize: '40px', color: '#28a745' }}>🛠️</div>
                      <h6 className="mt-2">Service Provider</h6>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className="card p-3 mb-3 shadow-sm"
                      style={{ cursor: 'pointer', border: '2px solid #007bff', transition: 'transform 0.3s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      onClick={() => handleRoleSelection('seeker')}
                    >
                      <div style={{ fontSize: '40px', color: '#007bff' }}>🔍</div>
                      <h6 className="mt-2">Service Seeker</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
