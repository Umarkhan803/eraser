import { proxyUrl } from "./utils";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: proxyUrl(),
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor to handle errors and token storage
axiosInstance.interceptors.response.use(
  (response) => {
    // Store token if present in response
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Dispatch a custom event instead of doing a hard redirect
      // This allows the auth context to handle the redirect gracefully
      window.dispatchEvent(new CustomEvent("unauthorized"));
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
