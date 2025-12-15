import { proxyurl } from "./utils";
import axios from "axios";
const token: string | null = localStorage.getItem("token");
const axiosInstance = axios.create({
  baseURL: proxyurl(), // Replace with your API base URL
  timeout: 10000,
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      const headers = config.headers;
      if (headers && typeof headers.delete === "function") {
        headers.delete("Content-Type");
        headers.delete("content-type");
      } else if (headers) {
        delete headers["Content-Type"];
        delete headers["content-type"];
      }
    } else if (
      !config.headers["Content-Type"] &&
      !(config.data instanceof FormData)
    ) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);
export default axiosInstance;
