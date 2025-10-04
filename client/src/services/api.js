import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Test Results API
export const resultsAPI = {
  saveResult: async (resultData) => {
    const response = await api.post('/results', resultData);
    return response.data;
  },

  getUserResults: async (page = 1, limit = 10) => {
    const response = await api.get(`/results/user?page=${page}&limit=${limit}`);
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/results/stats');
    return response.data;
  },

  getLeaderboard: async (duration = 60, limit = 10) => {
    const response = await api.get(`/results/leaderboard?duration=${duration}&limit=${limit}`);
    return response.data;
  }
};

// AI API
export const aiAPI = {
  generateText: async (difficulty, category, userErrors = []) => {
    const response = await api.post('/ai/generate-text', {
      difficulty,
      category,
      userErrors
    });
    return response.data;
  },

  analyzeErrors: async (performanceData) => {
    const response = await api.post('/ai/analyze-errors', performanceData);
    return response.data;
  }
};

export default api;
