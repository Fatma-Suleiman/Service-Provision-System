// src/screens/ProviderProfileScreen.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ProviderProfileScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    phone_number: '',
    description: '',
    price: '',
    location: '',
    image: null,      // the File object when picking a new image
    imageUrl: null,   // the URL (either from server or objectURL) for preview
  });
  const [existingProfile, setExistingProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // On mount: load existing profile if any
  useEffect(() => {
    api.get('/providers/me')
      .then(({ data }) => {
        setExistingProfile(true);
        setFormData({
          name: data.name,
          category: data.category,
          phone_number: data.phone_number,
          description: data.description || '',
          price: data.price?.toString() || '',
          location: data.location || '',
          image: null,
          imageUrl: data.image || null,    // set initial preview URL
        });
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setExistingProfile(false);
        } else {
          console.error('Profile load error', err);
          setMessage('Error loading profile');
        }
      });
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      if (!file) return;
      // create temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setFormData(f => ({
        ...f,
        image: file,
        imageUrl: previewUrl,
      }));
    } else {
      setFormData(f => ({
        ...f,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const body = new FormData();
      // append only non-null values
      Object.entries(formData).forEach(([k, v]) => {
        if (v != null && k !== 'imageUrl') {
          body.append(k, v);
        }
      });

      const method = existingProfile ? 'put' : 'post';
      await api[method]('/providers/me', body);

      setMessage(
        existingProfile
          ? 'Profile updated successfully!'
          : 'Profile created successfully!'
      );

      // redirect after a short delay to let the user read the message
      setTimeout(() => navigate('/provider/my-profile'), 1000);
    } catch (err) {
      console.error('Save error:', err);
      setMessage(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (existingProfile === null) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"/>
      </div>
    );
  }

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card p-4" style={{ maxWidth: 500, width: '100%' }}>
        <h2 className="text-center mb-4">
          {existingProfile ? 'Edit Your Profile' : 'Create Your Profile'}
        </h2>

        {message && (
          <div
            className={`alert ${
              message.includes('successfully')
                ? 'alert-success'
                : 'alert-danger'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Name */}
          <div className="mb-3">
            <label className="form-label">Service Name</label>
            <input
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select…</option>
              <option value="plumbing">Plumbing</option>
              <option value="cleaning">Cleaning</option>
              <option value="electrical">Electrical</option>
              <option value="carpentry">Carpentry</option>
              <option value="tutoring">Tutoring</option>
              <option value="daycare">Daycare</option>
              <option value="photography">Photography & Videography</option>
              <option value="event">Event Planning</option>
              <option value="beauty">Beauty & Hair Services</option>
              <option value="tech">Tech Support & IT Services</option>
            </select>
          </div>

          {/* Phone */}
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              className="form-control"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Price */}
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Location */}
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              className="form-control"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Image Preview */}
          {existingProfile && formData.imageUrl && (
            <div className="mb-3 text-center">
              <img
                src={formData.imageUrl}
                alt={formData.name}
                className="img-thumbnail"
                style={{ maxWidth: 150 }}
                onError={e => {
                  e.currentTarget.src = '/images/default.png';
                }}
              />
            </div>
          )}

          

          {/* Image Upload */}
          <div className="mb-3">
            <label className="form-label">Profile Image</label>
            <input
              type="file"
              className="form-control"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading
              ? 'Saving…'
              : existingProfile
              ? 'Update Profile'
              : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProviderProfileScreen;
