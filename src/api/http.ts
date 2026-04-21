import axios from "axios";
import { ENV } from "../config/env";
import { useAuthStore } from "../store/authStore";
import { Platform } from "react-native";

export const http = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await useAuthStore.getState().logout();

      if (Platform.OS === "web") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);
