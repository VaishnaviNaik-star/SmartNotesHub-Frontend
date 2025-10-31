import axios from "axios";

const API = axios.create({
  baseURL:
  
    "https://smartnoteshub-backend.onrender.com/api", // ✅ Render backend
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://smartnoteshub-backend.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;


