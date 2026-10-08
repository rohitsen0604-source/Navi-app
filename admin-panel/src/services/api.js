import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://navi-app-8vqo.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


// Set bearer token if saved
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('naavi_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
