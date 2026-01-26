
import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [imageLoading, setImageLoading] = useState(true);

  //  Load the service details
  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await api.get(`/services/${id}`);
        setService(data);
      } catch (err) {
        console.error("Error fetching service details:", err);
        setFetchError('Failed to load service. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleBooking = async () => {
    setBookingError('');
    // must be logged in
    const token =
      localStorage.getItem('token') ||
      sessionStorage.getItem('token');
    if (!token) {
      setBookingError('You must be logged in to book.');
      return navigate('/login');
    }

    try {
      await api.post('/bookings', { service_id: id });
      alert('Booking successful!');
      navigate('/profile?tab=bookings');
    } catch (err) {
      console.error('Booking error:', err.response || err);
   
      const msg = err.response?.data?.message || 'Booking failed. Please try again.';
      setBookingError(msg);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p>Loading service details...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{fetchError}</div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="position-relative">
          {imageLoading && (
            <div
              className="placeholder-glow"
              style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <div className="spinner-border text-secondary" role="status" />
            </div>
          )}
          <img
            src={service.image || '/images/default-service.jpg'}
            alt={service.name}
            className={`card-img-top ${imageLoading ? 'd-none' : ''}`}
            style={{ height: 400, objectFit: 'cover', width: '100%' }}
            onLoad={() => setImageLoading(false)}
            onError={e => {
              e.target.src = '/images/default-service.jpg';
              setImageLoading(false);
            }}
          />
        </div>
        <div className="card-body">
          <h2 className="card-title mb-3">{service.name}</h2>
          <p className="card-text mb-4">{service.description}</p>
          <div className="row mb-4">
            <div className="col-md-6">
              <p className="h5"><strong>Price:</strong> {service.price}</p>
            </div>
            <div className="col-md-6">
              <p className="h5">
                <strong>Rating:</strong>{' '}
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={i < Math.floor(service.rating) ? 'text-warning' : 'text-secondary'}
                  >⭐</span>
                ))}
                ({service.rating})
              </p>
            </div>
          </div>
          {service.phone_number && (
            <p className="h5 mb-4">
              <strong>Contact:</strong>{' '}
              <a href={`tel:${service.phone_number}`} className="text-decoration-none">
                {service.phone_number}
              </a>
            </p>
          )}
          <div className="d-flex gap-3 mt-4">
            <button
              className="btn btn-primary btn-lg flex-grow-1"
              onClick={handleBooking}
            >
              Book Now
            </button>
            <button
              className="btn btn-outline-secondary btn-lg"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
          {bookingError && (
            <div className="alert alert-danger mt-3">{bookingError}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
