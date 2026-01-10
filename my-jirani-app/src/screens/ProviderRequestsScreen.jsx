import React, { useEffect, useState } from 'react';
import api from '../api';

const STATUSES = ['pending', 'accepted', 'completed', 'cancelled'];

export default function ProviderRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  // Track pending updates for better error handling
  const [pendingUpdates, setPendingUpdates] = useState({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/providers/me/requests');
        setRequests(data);
      } catch {
        setError('Failed to load requests');
      }
    };
    fetchRequests();
  }, []);

  const changeStatus = async (id, newStatus) => {
    try {
      //  Optimistic update
      setRequests(prev => prev.map(r =>
        r.id === id ? { ...r, status: newStatus } : r
      ));
      setPendingUpdates(prev => ({ ...prev, [id]: newStatus }));

      //  Actual API call
      await api.put(`/providers/me/requests/${id}`, { status: newStatus });

    } catch (err) {
      //  Rollback on error
      setRequests(prev => prev.map(r =>
        r.id === id ? { ...r, status: pendingUpdates[id] } : r
      ));
      alert(err.response?.data?.message || 'Update failed. Try again.');
    } finally {
      setPendingUpdates(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  return (
    <div className="container py-4">
      <h2>Your Incoming Requests</h2>

      {/* Brief overview subtitle */}
      <p className="text-muted">Overview of recent service requests</p>

      {/* Business notice */}
      <div className="alert alert-info text-center">
        Here are the latest service requests awaiting your action. Please review and prioritize accordingly.
      </div>

      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Details</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id}>
                <td>{r.details}</td>
                <td>{r.customer_name}</td>
                <td>{r.customer_phone}</td>
                <td>
                  <span className={`badge ${
                    r.status === 'completed' ? 'bg-success' :
                    r.status === 'accepted'  ? 'bg-primary' :
                    r.status === 'cancelled' ? 'bg-secondary' :
                                               'bg-warning'
                  }`}>
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={r.status}
                    onChange={e => changeStatus(r.id, e.target.value)}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
