import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import config from '@/config/config';
import { getSecureValue, removeSecureValue } from './secureStorage';

interface ApiErrorResponse {
  error?: string;
  message?: string;
  [key: string]: any;
}

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getSecureValue('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      const status = error.response?.status || 500;
      const message = error.response?.data?.error || 
                     error.response?.data?.message || 
                     error.message || 
                     'Request failed';
  
      // Clear auth data on 401
      if (status === 401) {
        removeSecureValue('authToken');
        removeSecureValue('userRole');
        removeSecureValue('userId');
      }
  
      return Promise.reject({
        status,
        message,
        data: error.response?.data
      });
    }
  );
    
export default api;