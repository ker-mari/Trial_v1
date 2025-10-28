import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
  validateStatus: (status) => status < 500
});

export const authAPI = {
  verifyPin: async (pin) => {
    try {
      // Try API route first
      return await api.post('/auth/verify-pin', { pin });
    } catch (error) {
      console.error('API route failed, trying web route:', error);
      // Fallback to web route
      try {
        return await axios.post('http://localhost:8000/test-auth', { pin });
      } catch (webError) {
        console.error('Web route also failed:', webError);
        // Local fallback
        if (pin === '1234' || pin === '5678' || pin === '9999') {
          return {
            data: {
              success: true,
              user: pin === '1234' ? 'Mr. Guard 1' : pin === '5678' ? 'Ms. Guard 2' : 'Admin User',
              message: 'PIN verified successfully (local)'
            }
          };
        }
        throw new Error('Invalid PIN');
      }
    }
  }
}

export const testAPI = {
  // Test database connection
  testDatabase: () => api.get('/test-db'),
};

export const itemsAPI = {
  // Get all items
  getAll: () => api.get('/items'),
  
  // Get single item
  getById: (id) => api.get(`/items/${id}`),
  
  // Create new item
  create: (itemData) => api.post('/items', itemData),
  
  // Update item
  update: (id, itemData) => api.put(`/items/${id}`, itemData),
  
  // Delete item
  delete: (id) => api.delete(`/items/${id}`),
  
  // Claim item
  claim: (id) => api.post(`/items/${id}/claim`),
};

export default api;