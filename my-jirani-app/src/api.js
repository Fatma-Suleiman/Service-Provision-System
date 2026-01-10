
import axios from 'axios';

// An Axios instance with base API URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 

});

// Automatically attach token on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
