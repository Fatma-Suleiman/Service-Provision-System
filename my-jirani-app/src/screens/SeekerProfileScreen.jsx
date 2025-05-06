// src/screens/SeekerProfileScreen.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const SeekerProfileScreen = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError]       = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail]       = useState('');
  const [newPhone, setNewPhone]       = useState('');

  // Define handleLogout
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // our back-end returns { user: { id, username, email, phone_number }, bookings: [...] }
        const { data } = await api.get('/auth/profile');
        const { user, bookings } = data;
        setProfile({ user, bookings });
        setNewUsername(user.username);
        setNewEmail(user.email);
        setNewPhone(user.phone_number || '');
      } catch (err) {
        if (err.response?.status === 401) {
          return navigate('/login');
        }
        console.error('FETCH ERROR:', err);
        setError(err.response?.data?.message || 'Failed to fetch profile');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleProfileUpdate = async () => {
    try {
      const { data } = await api.put('/auth/profile', {
        username:    newUsername,
        email:       newEmail,
        phone_number: newPhone
      });
      // back-end responds { success: true, user: { … } }
      setProfile(p => ({ ...p, user: data.user }));
      alert('Profile updated!');
    } catch (err) {
      console.error('UPDATE ERROR:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (error) return <div className="alert alert-danger mt-5 text-center">{error}</div>;
  if (!profile) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status" />
      <p>Loading profile...</p>
    </div>
  );

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ width: '360px' }}>
        <h4 className="text-center mb-3">My Profile</h4>

        <input
          className="form-control mb-2"
          type="text"
          placeholder="Username"
          value={newUsername}
          onChange={e => setNewUsername(e.target.value)}
          required
        />

        <input
          className="form-control mb-2"
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          required
        />

        <input
          className="form-control mb-2"
          type="text"
          placeholder="Phone Number"
          value={newPhone}
          onChange={e => setNewPhone(e.target.value)}
          required
        />

        <button
          className="btn btn-success w-100 mb-3"
          onClick={handleProfileUpdate}
          disabled={!newUsername || !newEmail || !newPhone}
        >
          Update Profile
        </button>

        <button
          className="btn btn-danger w-100 mb-3"
          onClick={handleLogout}
        >
          Logout
        </button>

        <hr className="my-4" />

        <h6>Booking History</h6>
        {profile.bookings?.length ? (
          <ul className="list-group mt-2">
            {profile.bookings.map(b => (
              <li key={b.id} className="list-group-item">
                {b.service_name} — {new Date(b.date).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default SeekerProfileScreen;
