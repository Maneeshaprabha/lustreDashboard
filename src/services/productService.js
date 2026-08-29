import api from './api';

export const productService = {
  // Backend eke thiyena '/products' GET route eken data gannawa
  getAll: async () => {
    const response = await api.get('/products');
    return response.data.data;
  },
  
  // Backend eke thiyena '/products' POST route ekata data yawanawa
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Backend eke thiyena '/products/:id' DELETE route ekata id eka yawanawa
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};