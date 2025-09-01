import axios from 'axios';

export const api = axios.create({ 
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken }
          );
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth utilities
export const auth = {
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  },
};

// API endpoints
export const endpoints = {
  auth: {
    magicLink: '/auth/magic-link',
    verify: '/auth/verify',
    refresh: '/auth/refresh',
    google: '/auth/google',
  },
  users: {
    profile: '/users/profile',
    update: '/users/profile',
  },
  studios: {
    create: '/studios',
    list: '/studios',
    detail: (handle: string) => `/studios/${handle}`,
    update: (id: string) => `/studios/${id}`,
  },
  videos: {
    list: '/videos',
    create: '/videos',
    detail: (id: string) => `/videos/${id}`,
    update: (id: string) => `/videos/${id}`,
    delete: (id: string) => `/videos/${id}`,
  },
  uploads: {
    video: '/uploads/video',
    image: '/uploads/image',
    thumbnail: '/uploads/thumbnail',
    status: (id: string) => `/uploads/status/${id}`,
  },
  social: {
    tuneIn: '/tune-in',
    boost: '/boost',
    chat: '/video-chat',
    notifications: '/notifications',
  },
  wallet: {
    balance: '/wallet',
    transactions: '/wallet/transactions',
    addFunds: '/wallet/add-funds',
    withdraw: '/wallet/withdraw',
    transfer: '/wallet/transfer',
  },
};
