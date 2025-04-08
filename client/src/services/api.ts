import axios from 'axios';
import { Endpoint } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ErrorResponse {
  message: string;
  statusCode: number;
}

interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      const response = await api.post('/auth/register', { email, password, name });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

export const endpoints = {
  getAll: async () => {
    try {
      const response = await api.get<{ data: Endpoint[] }>('/endpoints');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get<{ data: Endpoint }>(`/endpoints/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  create: async (data: Omit<Endpoint, 'id'>) => {
    try {
      const response = await api.post<{ data: Endpoint }>('/endpoints', data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  update: async (id: string, data: Partial<Endpoint>) => {
    try {
      const response = await api.patch<{ data: Endpoint }>(`/endpoints/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  delete: async (id: string) => {
    try {
      await api.delete(`/endpoints/${id}`);
    } catch (error) {
      throw handleError(error);
    }
  },
};

function handleError(error: unknown): Error {
  if (axios.isAxiosError(error) && error.response?.data) {
    const errorResponse = error.response.data as ErrorResponse;
    return new Error(errorResponse.message || 'An unexpected error occurred');
  }
  return new Error('An unexpected error occurred');
}

export default {
  auth,
  endpoints,
}; 