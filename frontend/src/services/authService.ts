import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email: string, password: string) {
    // For now, simulate API call
    if (email === 'admin@trackmyshow.com' && password === 'admin123') {
      const mockUser = {
        id: '1',
        email: 'admin@trackmyshow.com',
        firstName: 'Bayazid',
        lastName: 'Hossain',
        role: 'super_admin' as const,
        avatar: null,
      };
      // Store token
      Cookies.set('auth_token', 'mock_token_123', { expires: 7 });
      return { user: mockUser, token: 'mock_token_123' };
    }
    throw new Error('Invalid credentials');
  },

  async getCurrentUser() {
    const token = Cookies.get('auth_token');
    if (!token) throw new Error('No token found');
    // For now, return mock user
    return {
      id: '1',
      email: 'admin@trackmyshow.com',
      firstName: 'Bayazid',
      lastName: 'Hossain',
      role: 'super_admin' as const,
      avatar: null,
    };
  },

  logout() {
    Cookies.remove('auth_token');
  },
};

export { api }; 