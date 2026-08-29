// const API_BASE_URL = 'http://localhost:5000/api';

// const request = async (endpoint, options = {}) => {
//   try {
//     const token = localStorage.getItem('lustre_token');

//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',

//         ...(token && {
//           Authorization: `Bearer ${token}`,
//         }),

//         ...(options.headers || {}),
//       },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         data.message || 'Something went wrong'
//       );
//     }

//     return data;
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
// };

// const api = {
//   get: (endpoint) =>
//     request(endpoint, {
//       method: 'GET',
//     }),

//   post: (endpoint, body) =>
//     request(endpoint, {
//       method: 'POST',
//       body: JSON.stringify(body),
//     }),

//   put: (endpoint, body) =>
//     request(endpoint, {
//       method: 'PUT',
//       body: JSON.stringify(body),
//     }),

//   patch: (endpoint, body) =>
//     request(endpoint, {
//       method: 'PATCH',
//       body: JSON.stringify(body),
//     }),

//   delete: (endpoint) =>
//     request(endpoint, {
//       method: 'DELETE',
//     }),
// };

// export default api;


import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    return response.data;
  },

  register: async (email, password, fullName) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      fullName,
    });

    return response.data;
  },
};