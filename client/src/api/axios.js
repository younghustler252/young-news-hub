import axios from "axios";

// Detect dev or production mode
const isDev = import.meta.env.DEV;

// Your backend URL from environment (production)
const PROD_URL = import.meta.env.VITE_API_BASE_URL;

// Auto–switching BASE_URL
const BASE_URL = isDev
  ? "http://localhost:3000"          // ⬅️ Dev mode
  : PROD_URL;                        // ⬅️ Production mode

// Create instance
const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
