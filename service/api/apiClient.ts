import { getAccessToken } from "@/src/utils/useAuth";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://api.furry-family.org",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
    async (config) => {
      const token = await getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );