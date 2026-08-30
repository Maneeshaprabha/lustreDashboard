import api from './api';

export const orderService = {
  // Get all orders from backend
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data.data;
  },
  
  // Create new order via backend
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  // Delete order via backend
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  }
};