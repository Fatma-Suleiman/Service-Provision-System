
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 

const ApplyServiceScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceName: '',
    category: '',
    phone: '',
    location: '',
    priceRange: '',
    image: null,     // the File object
    imageUrl: null,  // preview URL or eventual server path
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      if (!file) return;
      // create a local URL so we can preview immediately
      const preview = URL.createObjectURL(file);
      setFormData(f => ({
        ...f,
        image: file,
        imageUrl: preview,
      }));
    } else {
      setFormData(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const data = new FormData();
      data.append('serviceName', formData.serviceName);
      data.append('category', formData.category);
      data.append('phone', formData.phone);
      data.append('location', formData.location);
      data.append('priceRange', formData.priceRange);
      data.append('image', formData.image);

      await api.post('/providers/apply', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Application submitted successfully!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error) {
      setMessage('Failed to submit application.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '85vh' }}
    >
      <div className="card p-4 shadow" style={{ width: '450px' }}>
        <h2 className="text-center mb-4">Apply as a Service Provider</h2>

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
          {/* Service Name */}
          <div className="mb-3">
            <label className="form-label">Service Name</label>
            <input
              type="text"
              name="serviceName"
              className="form-control"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder="E.g., Elite Plumbing Services"
              required
            />
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="plumbing">Plumbing</option>
              <option value="cleaning">Cleaning</option>
              <option value="electrical">Electrical</option>
              <option value="carpentry">Carpentry</option>
              <option value="tutoring">Tutoring</option>
              <option value="daycare">Daycare</option>
              <option value="photography">
                Photography & Videography
              </option>
              <option value="event">Event Planning</option>
              <option value="beauty">Beauty & Hair Services</option>
              <option value="tech">Tech Support & IT Services</option>
            </select>
          </div>

          {/* Phone */}
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              placeholder="E.g., +254700123456"
              required
            />
          </div>

          {/* Location */}
          <div className="mb-3">
            <label className="form-label">
              Location (e.g., Nairobi, Westlands)
            </label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your area"
              required
            />
          </div>

          {/* Price Range */}
          <div className="mb-3">
            <label className="form-label">Price Range</label>
            <input
              type="text"
              name="priceRange"
              className="form-control"
              value={formData.priceRange}
              onChange={handleChange}
              placeholder="E.g., Starting from Ksh. 500"
              required
            />
          </div>

          {/* Image Preview */}
          {formData.imageUrl && (
            <div className="mb-3 text-center">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="img-thumbnail"
                style={{ maxWidth: 150 }}
                onError={e => {
                  e.currentTarget.src = '/images/default-provider.png';
                }}
              />
            </div>
          )}

          {/* Upload Image */}
          <div className="mb-3">
            <label className="form-label">Upload Profile Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyServiceScreen;
