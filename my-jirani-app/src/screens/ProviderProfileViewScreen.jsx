// src/screens/ProviderProfileView.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ProviderProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/providers/me')
      .then(({ data }) => {
        setProfile(data);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          navigate('/provider/profile');
        } else {
          console.error('Error loading profile', err);
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status"/>
      </div>
    );
  }
  if (!profile) return null;

  return (
    <div className="container py-5">
      <div className="card shadow-lg">
        <div className="row g-0">
          {profile.image && (
            <div className="col-md-4">
              <img
                // Use the normalized path coming from your backend:
                src={profile.image}
                className="img-fluid rounded-start h-100 w-100"
                alt={profile.name}
                style={{ objectFit: 'cover' }}
                onError={e => {
                  // Prevent an infinite error loop
                  e.currentTarget.onerror = null;
                  // Fallback to a known-good stock image in public/images
                  e.currentTarget.src = '/images/default-service.jpg';
                }}
              />
            </div>
          )}
          <div className={`col-md-${profile.image ? '8' : '12'}`}>
            <div className="card-body">
              <h3 className="card-title text-primary">{profile.name}</h3>
              <p className="badge bg-secondary text-uppercase">{profile.category}</p>

              <dl className="row mt-3">
                <dt className="col-sm-4">Phone:</dt>
                <dd className="col-sm-8">{profile.phone_number}</dd>
                <dt className="col-sm-4">Description:</dt>
                <dd className="col-sm-8">{profile.description}</dd>
                <dt className="col-sm-4">Price:</dt>
                <dd className="col-sm-8">{profile.price}</dd>
                <dt className="col-sm-4">Location:</dt>
                <dd className="col-sm-8">{profile.location}</dd>
              </dl>

              <button
                className="btn btn-outline-primary"
                onClick={() => navigate('/provider/profile')}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfileView;
