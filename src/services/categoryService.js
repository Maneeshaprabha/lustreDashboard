import api from './api';

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data.data;
  },
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
  delete: async (rawId) => {
    const response = await api.delete(`/categories/${rawId}`);
    return response.data;
  }
};