import axios from "axios";

// Detect dev or production mode
const isDev = import.meta.env.DEV;

// Environment URLs
const PROD_URL = import.meta.env.VITE_API_BASE_URL;

// Base URL selection
const BASE_URL = isDev ? "http://localhost:3000" : PROD_URL;

if (!isDev && !PROD_URL) {
  console.warn("⚠️ VITE_API_BASE_URL is missing in production build.");
}

// Create axios instance
const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// Token helper
const getToken = () => localStorage.getItem("token");

// Request interceptor
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor (optional)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
