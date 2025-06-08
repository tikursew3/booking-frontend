import axios from "axios";
//import { toast } from "react-hot-toast";
//import Router from "next/router"; // Important: use Next.js router manually

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
  
});



// Request Interceptor Automatically attach Authorization token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers = config.headers || {}; // Ensure headers is defined
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default api;
