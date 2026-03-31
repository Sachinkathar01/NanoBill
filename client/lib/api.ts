import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  // Critical for JWT verification! Allows Node to read/write auth cookies securely.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

// http://localhost:5001/api