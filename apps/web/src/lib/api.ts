import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
          const response = await api.post('/auth/refresh', { token: refreshToken });
          const { accessToken } = response.data;

          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  register: (data: {
    email: string;
    username: string;
    handle: string;
    displayName: string;
    password: string;
  }) => api.post('/auth/register', data),

  verifyToken: (token: string) =>
    api.post('/auth/verify', { token }),

  getProfile: () => api.get('/auth/profile'),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),

  updateProfile: (data: {
    displayName?: string;
    bio?: string;
    avatar?: string;
  }) => api.put('/users/profile', data),

  getUser: (id: string) => api.get(`/users/${id}`),

  getUserByHandle: (handle: string) => api.get(`/users/handle/${handle}`),

  searchUsers: (query: string, limit?: number) =>
    api.get('/users/search', { params: { q: query, limit } }),

  deleteProfile: () => api.delete('/users/profile'),
};

// Studios API
export const studiosAPI = {
  createStudio: (data: {
    name: string;
    handle: string;
    description?: string;
    category?: string;
    isPublic?: boolean;
  }) => api.post('/studios', data),

  getStudio: (id: string) => api.get(`/studios/${id}`),

  getStudioByHandle: (handle: string) => api.get(`/studios/handle/${handle}`),

  getUserStudios: () => api.get('/studios/my-studios'),

  updateStudio: (id: string, data: {
    name?: string;
    description?: string;
    category?: string;
    isPublic?: boolean;
  }) => api.put(`/studios/${id}`, data),

  deleteStudio: (id: string) => api.delete(`/studios/${id}`),

  searchStudios: (query: string, limit?: number) =>
    api.get('/studios/search', { params: { q: query, limit } }),

  followStudio: (studioId: string) => api.post(`/studios/${studioId}/follow`),

  unfollowStudio: (studioId: string) => api.delete(`/studios/${studioId}/follow`),
};

// Videos API
export const videosAPI = {
  uploadVideo: (data: FormData) =>
    api.post('/videos/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  createVideo: (data: {
    title: string;
    description?: string;
    tags?: string[];
    category?: string;
    visibility?: string;
    studioId?: string;
  }) => api.post('/videos', data),

  getVideo: (id: string) => api.get(`/videos/${id}`),

  getUserVideos: () => api.get('/videos/my-videos'),

  updateVideo: (id: string, data: {
    title?: string;
    description?: string;
    tags?: string[];
    category?: string;
    visibility?: string;
  }) => api.put(`/videos/${id}`, data),

  deleteVideo: (id: string) => api.delete(`/videos/${id}`),

  searchVideos: (query: string, limit?: number) =>
    api.get('/videos/search', { params: { q: query, limit } }),
};

// Community API
export const communityAPI = {
  createRoom: (data: {
    name: string;
    description?: string;
    category?: string;
    isPublic?: boolean;
  }) => api.post('/community/rooms', data),

  getRooms: () => api.get('/community/rooms'),

  getRoom: (id: string) => api.get(`/community/rooms/${id}`),

  joinRoom: (roomId: string) => api.post(`/community/rooms/${roomId}/join`),

  leaveRoom: (roomId: string) => api.delete(`/community/rooms/${roomId}/join`),

  searchRooms: (query: string, limit?: number) =>
    api.get('/community/rooms/search', { params: { q: query, limit } }),
};

// Monetization API
export const monetizationAPI = {
  getEarnings: () => api.get('/monetization/earnings'),

  getRevenueStreams: () => api.get('/monetization/revenue-streams'),

  getTransactions: () => api.get('/monetization/transactions'),

  createMembershipTier: (data: {
    name: string;
    price: number;
    benefits: string[];
  }) => api.post('/monetization/memberships', data),

  getMembershipTiers: () => api.get('/monetization/memberships'),

  createProduct: (data: {
    name: string;
    price: number;
    description?: string;
    type: string;
  }) => api.post('/monetization/store/products', data),

  getProducts: () => api.get('/monetization/store/products'),

  requestPayout: (data: { amount: number; method: string }) =>
    api.post('/monetization/payouts', data),
};

export default api;
