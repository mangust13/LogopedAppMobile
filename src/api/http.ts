import axios from "axios";
import { ENV } from "../config/env";

let accessToken: string | null = null;
let unauthorizedHandler: (() => Promise<void>) | null = null;
let isHandlingUnauthorized = false;

export const setHttpToken = (token: string | null) => {
  accessToken = token;
};

export const setUnauthorizedHandler = (handler: () => Promise<void>) => {
  unauthorizedHandler = handler;
};

export const http = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      unauthorizedHandler &&
      !isHandlingUnauthorized
    ) {
      isHandlingUnauthorized = true;

      try {
        await unauthorizedHandler();
      } finally {
        isHandlingUnauthorized = false;
      }
    }

    return Promise.reject(error);
  },
);
