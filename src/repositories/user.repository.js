import api from '../services/api';

const userRepository = {
  getAll: async (params) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Note: updateProfile is already in auth.service for local storage sync, 
  // but we should eventually unify or use it here
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  }
};

export default userRepository;
