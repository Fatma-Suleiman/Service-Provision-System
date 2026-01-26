import  { useEffect, useState } from 'react';
import api from '../api';

const ProviderDashboard = () => {
  const [summary, setSummary] = useState({
    totalRequests: 0,
    completedRequests: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        //  Fetch booking summary
        const { data: summaryData } = await api.get('/providers/me/summary');
        setSummary(summaryData);

        //  Fetch recent requests
        const { data: requestsData } = await api.get('/providers/me/requests');
        const transformed = requestsData
          .slice(0, 5)
          .map(r => ({
            id: r.id,
            serviceName: r.details,
            seekerName: r.customer_name,
            seekerPhone: r.customer_phone,
            date: r.created_at,
            status: r.status,
          }));

        console.log('Dashboard recentRequests ', transformed);
        setRecentRequests(transformed);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err.response?.data?.message || 'Could not load dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-5 text-center">{error}</div>;
  }

  return (
    <div className="container py-4">
      <h3 className="mb-4">Dashboard</h3>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Requests</h5>
              <p className="display-4">{summary.totalRequests}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Completed</h5>
              <p className="display-4">{summary.completedRequests}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Avg Rating</h5>
              <p className="display-4">{summary.averageRating}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Reviews</h5>
              <p className="display-4">{summary.totalReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests List */}
      <h5>Recent Requests</h5>
      {recentRequests.length === 0 ? (
        <p className="text-muted">No recent requests.</p>
      ) : (
        <ul className="list-group">
          {recentRequests.map(r => (
            <li key={r.id} className="list-group-item">
              <strong>{r.serviceName}</strong> by <em>{r.seekerName}</em>
              <br />
              <small>📞 {r.seekerPhone}</small>
              <br />
              <small>{new Date(r.date).toLocaleDateString()}</small>
              <span
                className={`badge float-end bg-${
                  r.status === 'pending'  ? 'warning' :
                  r.status === 'accepted' ? 'success' :
                                            'danger'
                }`}
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

export default ProviderDashboard;
