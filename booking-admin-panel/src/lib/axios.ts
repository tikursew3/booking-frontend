import axios from "axios";
//import { toast } from "react-hot-toast";
//import Router from "next/router"; // Important: use Next.js router manually

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL // Your backend base URL
});

// Send cookies automatically
axios.defaults.withCredentials = true;

/*

// Request Interceptor Automatically attach Authorization token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers = config.headers || {}; // make sure headers object exists
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Response Interceptor — handle 401 errors
api.interceptors.response.use(
  (response) => response, // If success, just pass the response
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh-token"); // 🔥 Try refresh token
        return api(originalRequest); // 🔥 Retry original request after refresh
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("adminToken");
        setTimeout(() => {
          Router.push("/admin/login");
        }, 1000);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
*/


export default api;
