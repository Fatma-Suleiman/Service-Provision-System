import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchCategories = async () => {
      try {
        const res = await api.get('/services/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories.');
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = () => {
    if (!selectedCategory) {
      setError('Please select a category.');
      return;
    }
    navigate(`/category/${selectedCategory}?rating=${rating}`);
  };

  return (
    <div className="container mt-4">
      <h2>Select a Service Provider</h2>

      {/* Category Filter */}
      <div className="mb-3">
        <label className="form-label">Category:</label>
        <select
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div className="mb-3">
        <label className="form-label">Minimum Rating:</label>
        <input
          type="number"
          className="form-control"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="0"
          max="5"
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <button className="btn btn-primary" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default CategoriesScreen;
