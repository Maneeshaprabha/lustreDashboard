import api from './api';

export const expenseService = {
  getAll: async () => (await api.get('/expenses')).data.data,
  create: async (data) => (await api.post('/expenses', data)).data.data,
  update: async (id, data) => (await api.put(`/expenses/${id}`, data)).data.data,
  delete: async (id) => (await api.delete(`/expenses/${id}`)).data
};