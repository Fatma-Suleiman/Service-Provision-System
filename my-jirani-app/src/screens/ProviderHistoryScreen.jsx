import React, { useEffect, useState } from 'react';
import api from '../api'; 

const ProviderHistoryScreen = () => {
  const [requests, setRequests] = useState([]);
  const [completedRequests, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/providers/me/requests'); 
        setRequests(
          data.map((r) => ({
            id: r.id,
            details: r.details,
            status: r.status,
            created_at: r.created_at,
            customer_name: r.customer_name,
            customer_phone: r.customer_phone,    
          }))
        );
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError(err.response?.data?.message || 'Failed to load requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="container py-4">
      <h3 className="mb-4">Service Requests</h3>
      <div className="d-flex border-start border-4 ps-3 py-2 mb-3 shadow-sm" style={{ borderColor: '#1877F2', backgroundColor: '#f8f9fa', borderRadius: '0.5rem' }}>
  <p className="mb-0 text-muted" style={{ fontSize: '0.95rem' }}>
    Welcome back. Below is a summary of your recent service requests. Keeping track of your client engagements helps build trust, deliver timely service, and grow your reputation.
  </p>
</div>


<div className="alert alert-info d-flex align-items-center justify-content-between shadow-sm mb-4 rounded-3">
  <div>
    <h5 className="mb-0">🕘 Provider History</h5>
    <small>Track your service journey, follow up on past requests, and maintain excellence with every client.</small>
  </div>
  <span className="badge bg-light text-info fw-semibold px-3 py-2">
    Building a Legacy of Trust
  </span>
</div>


      
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status" />
          <p>Loading requests...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger mt-5 text-center">{error}</div>
      ) : requests.length === 0 ? (
        <p className="text-muted">No requests found.</p>
      ) : (
        <ul className="list-group">
          {requests.map((r) => (
            <li
              key={r.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{r.details}</strong> from <em>{r.customer_name}</em>
                <br />
                <small>{new Date(r.created_at).toLocaleString()}</small>
                <br />
   <small>📞 {r.customer_phone}</small>
              </div>
              <span
                className={`badge bg-${
                  r.status === 'pending'
                    ? 'warning'
                    : r.status === 'accepted'
                    ? 'success'
                    : 'danger'
                } float-end`}
              >
                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProviderHistoryScreen;
