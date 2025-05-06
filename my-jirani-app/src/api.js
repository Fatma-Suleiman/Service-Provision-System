// src/api.js
import axios from 'axios';

// Create an Axios instance with your base API URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this to your backend URL

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
