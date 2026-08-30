import api from './api';

export const settingService = {
  get: async () => (await api.get('/settings')).data.data,
  update: async (data) => (await api.put('/settings', data)).data,
  updatePassword: async (data) => (await api.put('/settings/password', data)).data,
};