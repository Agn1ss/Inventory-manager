import type { AuthResponse } from "../models/response/AuthResponse"; 
import axios from "axios";

export const API_URL = "http://localhost:5000/api";

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

$api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;

      try {
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
        });

        localStorage.setItem("token", response.data.accessToken);

        return $api.request(originalRequest);
      } catch (e) {
        await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }

    if (error.response?.status === 403) {      
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    throw error;
  }
);

export default $api;
