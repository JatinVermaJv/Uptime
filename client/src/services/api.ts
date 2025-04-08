import axios from 'axios';
import { Endpoint, User, ApiResponse } from '@/types';

// Define custom types for better type safety
type ApiError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
  config?: {
    headers?: Record<string, string>;
    _retry?: boolean;
    url?: string;
    method?: string;
  };
};

type RefreshResponse = {
  data: {
    token: string;
  };
};

type ApiRequestConfig = {
  headers?: Record<string, string>;
  _retry?: boolean;
  url: string;
  method: string;
};

const API_BASE_URL = 'https://uptime-tj3r.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for handling cookies
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error: ApiError) => {
    console.error('Response Error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    const originalRequest = error.config as ApiRequestConfig;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      console.log('Attempting token refresh...');
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const response = await api.post('/auth/refresh') as RefreshResponse;
        const { token } = response.data;
        console.log('Token refreshed successfully');

        // Update token in localStorage
        localStorage.setItem('token', token);

        // Retry the original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If refresh fails, logout the user
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const auth = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
};

export const endpoints = {
  getAll: () => api.get('/endpoints'),
  getOne: (id: string) => api.get(`/endpoints/${id}`),
  create: (data: { name: string; url: string; interval: number }) =>
    api.post('/endpoints', data),
  update: (id: string, data: { name?: string; url?: string; interval?: number }) =>
    api.put(`/endpoints/${id}`, data),
  delete: (id: string) => api.delete(`/endpoints/${id}`),
  getLogs: (id: string, params?: { limit?: number; offset?: number }) =>
    api.get(`/endpoints/${id}/logs`, { params }),
};

export const settings = {
  get: () => api.get('/settings'),
  update: (data: { notifications: boolean; emailAlerts: boolean; refreshInterval: number }) =>
    api.put('/settings', data),
};

// Error handling utility
export const handleApiError = (error: unknown): string => {
  console.error('API Error:', error);
  const apiError = error as ApiError;
  if (apiError.response?.data?.message) {
    return apiError.response.data.message;
  }
  if (apiError.message) {
    return apiError.message;
  }
  return 'An unexpected error occurred';
};

export default api; 