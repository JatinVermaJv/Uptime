export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Endpoint {
  id: string;
  name: string;
  url: string;
  userId: string;
  interval: number;
  status: 'up' | 'down' | 'unknown';
  lastChecked?: Date;
  pingLogs: PingLog[];
}

export interface PingLog {
  id: string;
  endpointId: string;
  status: 'up' | 'down';
  responseTime: number;
  createdAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface Settings {
  id: string;
  userId: string;
  refreshInterval: number;
  notifications: boolean;
  darkMode: boolean;
  createdAt: string;
  updatedAt: string;
} 