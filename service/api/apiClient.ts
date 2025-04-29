import { getAccessToken } from '@/src/hooks/useAuth';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://furry-family.org:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    console.log("헤더",token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
