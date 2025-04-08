import axios from 'axios';
import { Endpoint, User, ApiResponse } from '@/types';
import { useRouter } from 'next/navigation';

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

const API_BASE_URL = 'https://uptime-tj3r.onrender.com';

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
      data: config.data,
      headers: config.headers
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
      data: response.data
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't retried the request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await api.post<RefreshResponse>('/api/auth/refresh');
        const { token } = response.data.data;
        
        // Store the new token
        localStorage.setItem('token', token);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// API endpoints
export const auth = {
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/api/auth/register', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return api.post('/api/auth/logout');
  },
  refresh: () => api.post('/api/auth/refresh'),
};

export const endpoints = {
  getAll: () => api.get('/api/endpoints'),
  getOne: (id: string) => api.get(`/api/endpoints/${id}`),
  create: async (data: { name: string; url: string; interval: number }) => {
    try {
      // Log the incoming data
      console.log('Creating endpoint with data:', data);

      // Ensure URL is properly formatted
      let url = data.url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      
      // Ensure interval is a number between 1 and 60
      const interval = Math.min(Math.max(Number(data.interval), 1), 60);
      
      const payload = {
        name: data.name.trim(),
        url: url,
        interval: interval
      };

      // Log the final payload
      console.log('Sending payload:', payload);

      // Log the request configuration
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };
      console.log('Request config:', config);

      const response = await api.post('/api/endpoints', payload, config);
      console.log('Response:', response.data);
      return response;
    } catch (error: any) {
      console.error('Endpoint creation error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers
        }
      });
      throw error;
    }
  },
  update: (id: string, data: { name?: string; url?: string; interval?: number }) => {
    const payload: any = {};
    
    if (data.name) payload.name = data.name.trim();
    if (data.url) {
      let url = data.url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      payload.url = url;
    }
    if (typeof data.interval === 'number') {
      payload.interval = Math.min(Math.max(Number(data.interval), 1), 60);
    }
    
    return api.put(`/api/endpoints/${id}`, payload);
  },
  delete: (id: string) => api.delete(`/api/endpoints/${id}`),
  getLogs: (id: string, params?: { limit?: number; offset?: number }) =>
    api.get(`/api/endpoints/${id}/logs`, { params }),
};

export const settings = {
  get: () => api.get('/settings'),
  update: (data: { notifications: boolean; emailAlerts: boolean; refreshInterval: number }) =>
    api.put('/settings', data),
};

// Error handling utility
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  if (error.response) {
    // Log detailed error information
    console.error('Error Details:', {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });

    // Return appropriate error message
    if (error.response.status === 400) {
      return error.response.data?.message || 'Invalid request. Please check your input.';
    } else if (error.response.status === 401) {
      return 'Please log in to continue.';
    } else if (error.response.status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (error.response.status === 404) {
      return 'The requested resource was not found.';
    }
    return error.response.data?.message || 'An error occurred';
  } else if (error.request) {
    console.error('Request Error:', error.request);
    return 'No response from server. Please check your internet connection.';
  } else {
    console.error('Error:', error.message);
    return error.message || 'An unexpected error occurred';
  }
};

export default api; 