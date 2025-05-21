import { TokenStorage } from "@/src/utils/useAuth";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type ApiSuccess = { success: true; response: AxiosResponse };
type ApiFailure = { success: false; status: number; message: string };
type ApiResult = ApiSuccess | ApiFailure;

const apiClient = axios.create({
  baseURL: "https://api.furry-family.org",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = TokenStorage.get("access");
    console.log("TOKEN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!S",token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export class ApiService {
  static async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResult> {
    try {
      const response = await apiClient.get<T>(url, config);

      return { success: true, response: response };
    } catch (error) {
      const response = handleAxiosError(error);
      return response;
    }
  }

  static async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResult> {
    try {
      const response = await apiClient.post<T>(url, data, config);
      return { success: true, response: response };
    } catch (error) {
      const response = handleAxiosError(error);
      return response;
    }
  }

  static async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResult> {
    try {
      const response = await apiClient.put<T>(url, data, config);
      return { success: true, response: response };
    } catch (error) {
      const response = handleAxiosError(error);
      return response;
    }
  }

  static async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResult> {
    try {
      const response = await apiClient.delete<T>(url, config);
      return { success: true, response: response };
    } catch (error) {
      const response = handleAxiosError(error);
      return response;
    }
  }
}

function handleAxiosError(error: unknown): ApiResult {
  console.log(error)
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? -1;
    console.log("🔴 fialed api request");
    console.log("🔸 status:", status);
    console.log("🔸 data:", error.response?.data.message);
    return {
      success: false,
      status: status,
      message: error.response?.data.message,
    };
  } else {
    console.log("❗ unexpected error:", error);
    return { success: false, status: -999, message: "unexpected error" };
  }
}
