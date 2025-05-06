import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api'; 
 
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve role from storage (set at login role selection)
  const role = localStorage.getItem('role') || sessionStorage.getItem('role') || '';
  // Determine profile path
  const profilePath = role === 'provider' ? '/provider/my-profile' : '/profile';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await api.get('/auth/profile');

        // Handle both response structures for backward compatibility
        const userData = res.data.user || res.data;
        if (userData) {
          setUser(userData);
          localStorage.setItem('username', userData.username);
        }
      } catch (err) {
        console.error('Profile Error:', err.response?.data || err.message);
        // Only logout on 401 Unauthorized errors
        if (err.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    setUser(null);
    navigate('/login');
  };

  // Fallback for initials
  const username = user?.username || localStorage.getItem('username') || 'User';
  const initial = username.charAt(0).toUpperCase();

  if (loading) {
    return (
      <nav className="navbar navbar-expand-lg shadow-lg p-3 mb-4 bg-white rounded">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            JIRANI CONNECT
          </Link>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg shadow-lg p-3 mb-4 bg-white rounded">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          JIRANI CONNECT
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} to="/about">
                About
              </Link>
            </li>

            {/* Seeker-only links */}
            {user && role === 'seeker' && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === '/categories' ? 'active' : ''}`}
                    to="/categories"
                  >
                    Browse Services
                  </Link>
                </li>

              </>
            )}

            {/* Provider-only links */}
            {user && role === 'provider' && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === '/provider/dashboard' ? 'active' : ''}`} to="/provider/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === '/provider/requests' ? 'active' : ''}`} to="/provider/requests">Requests</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === '/provider/history' ? 'active' : ''}`} to="/provider/history">History</Link>
                </li>
              </>
            )}

            {/* Auth dropdown */}
            {!user ? (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle fw-bold text-primary"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: '50%',
                      backgroundColor: '#007bff',
                      color: 'white',
                      display: 'inline-flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '1rem',
                    }}
                  >
                    {initial}
                  </div>
                </span>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">

                  <li>
                    <Link className="dropdown-item" to={profilePath}>
                      Profile
                    </Link>
                  </li>

                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}


