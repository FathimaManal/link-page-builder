import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Attaches JWT on every request — use for protected routes
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Never sends a token — use for the public profile route
export const publicApi = axios.create({ baseURL: BASE_URL });

export default api;
