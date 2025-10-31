import axios from "axios";

const API = axios.create({
  baseURL: "https://smartnoteshub-backend.onrender.com/api", // ✅ your deployed backend
});

// Attach token automatically (for authorized routes)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
