
import axios from 'axios';


const api = axios.create({
 baseURL: 'https://project-jirani-backend.onrender.com/api',
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
