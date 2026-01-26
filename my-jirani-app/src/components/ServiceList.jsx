
import  { useState, useEffect } from 'react';
import api from '../api';             
import axios from 'axios';          
import MapComponent from './MapComponent';
import { useParams } from 'react-router-dom';

const ServiceList = () => {
  const { category } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);

  // Geocoding function using OpenStreetMap Nominatim API
  const geocodeAddress = async (inputAddress) => {
    setLoading(true);
    setError(null);
    try {
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputAddress)}`;
      const response = await axios.get(geocodeUrl);
      if (response.data?.length) {
        const { lat, lon } = response.data[0];
        setCoords({ lat: parseFloat(lat), lon: parseFloat(lon) });
      } else {
        setError('Location not found. Try again.');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Failed to fetch location.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (address.trim()) {
      geocodeAddress(address);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      if (!category) return;
      setLoading(true);
      setError(null);
      try {
        // Build query params
        const params = { category };
        if (coords) {
          params.lat = coords.lat;
          params.long = coords.lon;
        }

        
        const { data } = await api.get('/services', { params });

        // Handle both response shapes
        if (data.providers) {
          setServices(data.providers);
        } else {
          setServices(data);
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Failed to load services.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [category, coords]);

  return (
    <div className="service-list-header">
      <h2>
        {category
          ? `${category.charAt(0).toUpperCase()}${category.slice(1)} Providers`
          : 'Service Providers'}
      </h2>

      {/* Address input form */}
      <form onSubmit={handleAddressSubmit} className="mb-3">
        <input
          type="text"
          placeholder="Enter your address (e.g., Nyayo Highrise)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="form-control"
          required
        />
        <button type="submit" className="btn btn-primary mt-2">
          {loading ? 'Setting location…' : 'Set Location'}
        </button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Map */}
      {services.length > 0 && <MapComponent services={services} userCoords={coords} />}

      {!loading && services.length === 0 && <div>No services available.</div>}
    </div>
  );
};

export default ServiceList;


