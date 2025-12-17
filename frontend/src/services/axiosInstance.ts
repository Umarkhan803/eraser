import { proxyUrl } from "./utils";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: proxyUrl(), // no JSON.stringify, no extra quotes
});

export default axiosInstance;
