// src/api.js
import axios from "axios";

// Create an axios instance
const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    "https://smartnoteshub-backend.onrender.com/api",
});

// Attach token automatically if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
