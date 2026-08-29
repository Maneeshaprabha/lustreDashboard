import api from './api';

export const productService = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data.data;
  },
  
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // --- WENAS KALA: Image eka backend ekata yawanawa ---
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file); // 'image' kiyana namen file eka attach karanawa

      // Backend eke aluth '/products/upload' route ekata POST karanawa
      const response = await api.post('/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Image upload karaddi meka aniwaryai
        },
      });

      return response.data.imageUrl; // Backend eken ena public URL eka return karanawa
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Failed to upload image through backend.");
    }
  }
};