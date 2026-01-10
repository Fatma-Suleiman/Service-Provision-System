// src/screens/RegisterScreen.jsx
import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username:     '',
    email:        '',
    phone_number: '',     
    password:     '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setMessage('');

    try {
      await api.post('/auth/register', {
        username:     formData.username,
        email:        formData.email,
        phone_number: formData.phone_number,  
        password:     formData.password
      });

      setMessage('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error registering user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Register</h2>
        {message && (
          <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          {/* Email */}
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
          {/* Phone Number */}
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              name="phone_number"             
              className="form-control"
              value={formData.phone_number}    
              onChange={handleChange}
              required
            />
          </div>
          {/* Password */}
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
          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account?{' '}
          <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;
