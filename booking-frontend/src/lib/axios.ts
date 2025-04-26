import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL = "https://photography-booking-production.up.railway.app",// ✅ Your backend base URL
  withCredentials: false,
});

export default api;
