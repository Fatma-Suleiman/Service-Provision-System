// src/screens/HomeScreen.jsx

import { useEffect, useState } from 'react';
import api from '../api';
import './HomeScreen.css';

const HomeScreen = () => {
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [completedRequests, setCompletedRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewInput, setReviewInput] = useState('');
  const [ratingInput, setRatingInput] = useState(5);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  // 1) Fetch public reviews (anyone can see)
  useEffect(() => {
    api.get('/reviews/all')
      .then(({ data }) => setReviews(data))
      .catch(err => console.error('Error loading reviews:', err));
  }, []);

  // 2) Fetch YOUR completed services (for the dropdown) once you’re logged in
  useEffect(() => {
    if (!token) return;
    console.log('Fetching completed for seeker with token:', token);
    api.get('/service-requests/completed')
      .then(({ data }) => {
        console.log('  completedRequests →', data);
      setCompletedRequests(data);
    })
      .catch(err => console.error('Error loading completed requests:', err));
  }, [token]);

  const handleReviewSubmit = async e => {
    e.preventDefault();
    if (!token) {
      return alert('Please log in to submit a review.');
    }
    try {
      await api.post('/reviews',
        {
          request_id: selectedRequestId,
          review:     reviewInput,
          rating:     ratingInput
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Review submitted!');
      setShowReviewForm(false);
      setReviewInput('');
      setRatingInput(5);
      setSelectedRequestId('');

      // Refresh reviews list
      const { data } = await api.get('/reviews/all');
      setReviews(data);
    } catch (err) {
      console.error('Submit error:', err);
      alert(err.response?.data?.message || 'Error submitting review.');
    }
  };

  return (
    <div className="container my-5">
      {/* Hero Section */}
      <div className="jumbotron text-center bg-light p-5 rounded">
        <h1 className="display-4">Welcome to JiraniConnect</h1>
        <p className="lead">Connect with trusted service providers in your local community.</p>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search for services"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" type="button">Search</button>
        </div>
      </div>

       {/* Featured Services */}
<section id="featured-services" className="container my-5">
  <h2 className="mb-4 text-center">Featured Services</h2>
  <div className="row">
    {(
      [
        {
          id: 1,
          name: 'Plumbing',
          description: 'Leaky faucet? Clogged drain? Connect with trusted, skilled plumbers for reliable repairs, installations, and emergency services. Fix it right, the first time.'
        },
        {
          id: 2,
          name: 'Cleaning',
          description: 'Reclaim your time and enjoy a sparkling space! Find reliable, thorough cleaning professionals for your home or office. One-time or regular service.'
        },
        {
          id: 3,
          name: 'Electrical',
          description: 'Faulty wiring? Need new fixtures? Ensure safety and quality with certified electricians for repairs, installations, and upgrades. Power up your home safely.'
        },
        {
          id: 4,
          name: 'Carpentry',
          description: 'From custom shelves to deck repairs, find skilled carpenters for beautiful, sturdy woodwork. Bring your vision to life with expert craftsmanship.'
        },
        {
          id: 5,
          name: 'Tutoring',
          description: 'Unlock potential and boost confidence! Find experienced tutors for all ages and subjects, from math help to test prep. Personalized learning support.'
        },
        {
          id: 6,
          name: 'Daycare',
          description: 'Find a nurturing, safe, and stimulating environment for your child. Connect with trusted daycare providers offering quality care and early learning.'
        },
        {
          id: 7,
          name: 'Photography & Videography',
          description: "Capture life's precious moments beautifully. Find talented photographers and videographers for weddings, events, portraits, and commercial projects. Freeze time perfectly."
        },
        {
          id: 8,
          name: 'Event Planning',
          description: 'Dream event, zero stress! Connect with creative and organized event planners for weddings, parties, corporate functions, and more. Let us handle the details.'
        },
        {
          id: 9,
          name: 'Beauty & Hair Services',
          description: 'Look radiant, feel amazing! Discover skilled stylists, makeup artists, and beauty therapists for hair, nails, skincare, and more. Your transformation awaits.'
        },
        {
          id: 10,
          name: 'Tech Support & IT Services',
          description: 'Frustrated by tech glitches? Get fast, reliable help! Find experts for computer repair, network setup, software issues, and IT support for home or business.'
        }
      ]
        .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(service => (
          <div key={service.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{service.name}</h5>
                <p className="card-text">{service.description}</p>
              </div>
            </div>
          </div>
        ))
    )}
  </div>
</section>


      {/* Reviews Section */}
      <section id="customer-reviews" className="container my-5">
        <h2 className="mb-4 text-center">What Our Users Say</h2>
        <div className="row">
          {reviews.length > 0 ? (
            reviews.map(r => (
              <div key={r.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-lg p-3">
                  <h5 className="mb-1">{r.username}</h5>
                  <small className="text-muted">{r.service_details}</small>
                  <p className="mt-3">"{r.review}"</p>
                  <div className="text-warning">{"⭐".repeat(r.rating)}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No reviews yet.</p>
          )}
        </div>

        <div className="text-center mt-4">
          <button
            className="btn btn-primary"
            onClick={() => token
              ? setShowReviewForm(true)
              : alert('Please log in to leave a review.')}
          >
            Leave a Review
          </button>
        </div>

        {showReviewForm && (
          <div className="review-form mt-4 p-3 border rounded">
            <h4>Submit Your Review</h4>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-3">
                <label className="form-label">Select Completed Service</label>
                <select
                  className="form-select"
                  value={selectedRequestId}
                  onChange={e => setSelectedRequestId(e.target.value)}
                  required
                >
                  <option value="">– choose –</option>
                  {completedRequests.map(req => (
                    <option key={req.id} value={req.id}>
                      {req.details} ({new Date(req.created_at).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Your Review</label>
                <textarea
                  className="form-control"
                  value={reviewInput}
                  onChange={e => setReviewInput(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Rating (1–5)</label>
                <input
                  type="number"
                  className="form-control"
                  value={ratingInput}
                  onChange={e => setRatingInput(Number(e.target.value))}
                  min="1"
                  max="5"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success me-2">Submit</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomeScreen;
