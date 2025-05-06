// src/screens/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';                // your centralized axios instance
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', phone_number: '' });
  const [bookingHistory, setBookingHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  // Helper: fetch only service requests for this seeker
  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings'); 
      
      setBookingHistory(data);
      setError('');
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to load bookings');
    }
  };

  // Fetch user profile on mount
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        const { user, bookings } = data;
        setUser(user);
        setFormData({
          username: user.username,
          email: user.email,
          phone_number: user.phone_number || ''
        });
        setBookingHistory(bookings || []);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Re-fetch when Booking History tab is active
  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();                 // initial load
      const interval = setInterval(fetchBookings, 1000); // poll every 1s
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleEditToggle = () => {
    setError('');
    setIsEditing(prev => !prev);
  };

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      const { data } = await api.put('/auth/profile', formData);
      setUser(data.user);
      setIsEditing(false);
      setError('');
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.response?.data?.message || 'Failed to save profile');
    }
  };

const formatDate = d => {
  const date = new Date(d);
  return isNaN(date) ? 'N/A' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatTime = t => {
  const date = new Date(t);
  return isNaN(date) ? 'N/A' : date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-4 mb-4">
          <div className="card text-center">
            <div className="card-body">
              <div className="mb-3 display-4 text-primary">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <h4>{user?.username}</h4>
              <p className="text-muted">{user?.email}</p>
              <div className="mt-4">
                <button
                  className={`btn btn-sm w-100 mb-2 ${activeTab==='profile'?'btn-primary':'btn-outline-primary'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile Details
                </button>
                <button
                  className={`btn btn-sm w-100 ${activeTab==='bookings'?'btn-primary':'btn-outline-primary'}`}
                  onClick={() => setActiveTab('bookings')}
                >
                  Booking History
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-8">
          {error && <div className="alert alert-danger">{error}</div>}

          {activeTab==='profile' ? (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Profile Information</h5>
                {isEditing ? (
                  <form onSubmit={handleSave}>
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
                    <button type="submit" className="btn btn-primary me-2">Save Changes</button>
                    <button type="button" className="btn btn-outline-secondary" onClick={handleEditToggle}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone_number}</p>
                    <button className="btn btn-primary" onClick={handleEditToggle}>Edit Profile</button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Booking History</h5>
                {bookingHistory.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                        <th>Provider</th>
                        <th>Details</th>
                        
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                  
                      <tbody>
  {bookingHistory.map(b => (
    <tr key={b.id}>
      <td>{b.service_name}</td>
      <td>{b.provider_name}</td>
      <td>{formatDate(b.booking_date)}</td>
      <td>{formatTime(b.booking_date)}</td>
      <td>
        <span className={`badge ${
          b.status === 'accepted' ? 'bg-success' :
          b.status === 'pending'  ? 'bg-warning' :
                                    'bg-secondary'
        }`}>
          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
        </span>
      </td>
      <td>
        {b.status === 'pending' && (
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={async () => {
              if (window.confirm('Cancel this booking?')) {
                try {
                  await api.patch(`/bookings/${b.id}/cancel`);
                  fetchBookings();  // reload the list
                } catch (err) {
                  console.error('Cancel error:', err);
                  alert('Could not cancel booking.');
                }
              }
            }}
          >
            Cancel
          </button>
        )}
      </td>
    </tr>
  ))}


                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted">No booking history found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
