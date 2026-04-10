import api from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/users/login', {
      email,
      password,
    });
    if (response.data.token && typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  updateProfile: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    if (response.data.user && typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },

  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  },

  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
};

export default authService;
