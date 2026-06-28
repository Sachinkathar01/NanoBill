import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
  // Critical for JWT verification! Allows Node to read/write auth cookies securely.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  console.log("[AXIOS REQUEST] Token in Zustand:", token ? "Exists" : "Missing", "for URL:", config.url);

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("[AXIOS RESPONSE ERROR] URL:", error?.config?.url, "Status:", error?.response?.status);
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      console.log("[AXIOS RESPONSE ERROR] 401 error received, logging out and redirecting...");
      useAuthStore.getState().logout();
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