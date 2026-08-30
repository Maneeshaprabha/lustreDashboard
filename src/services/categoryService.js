import api from './api';

export const categoryService = {
  // Get all categories
  getAll: async () => {
    const response = await api.get('/categories');
    // Backend එකෙන් එවන්නේ { success: true, data: formatted } නිසා, අපි data.data ගන්නවා
    return response.data.data;
  },

  // Create new category
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Delete category
  delete: async (rawId) => {
    const response = await api.delete(`/categories/${rawId}`);
    return response.data;
  },

  // Update category 
  update: async (rawId, categoryData) => {
    const response = await api.put(`/categories/${rawId}`, categoryData);
    return response.data;
  }
};