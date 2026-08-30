import api from './api';

export const authService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { 
      email, 
      password 
    });
    return response.data;
  },

  // Register user (fullName eka aniwaren yawna widiyata fix kala)
  register: async (email, password, fullName) => {
    const response = await api.post('/auth/register', { 
      email, 
      password, 
      fullName 
    });
    return response.data;
  },

  // Logout user
  logout: async () => {
    // If backend needs a logout endpoint, or just clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return { success: true };
  }
};