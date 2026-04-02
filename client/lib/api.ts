import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://nanobill-oc26.onrender.com/api",
  // Critical for JWT verification! Allows Node to read/write auth cookies securely.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// http://localhost:5001/api