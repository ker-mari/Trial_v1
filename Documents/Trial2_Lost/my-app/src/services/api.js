import axios from 'axios';

// Validate and restrict API base URL to prevent SSRF
const validateApiUrl = (url) => {
  const allowedHosts = ['localhost', '127.0.0.1'];
  try {
    const urlObj = new URL(url);
    return allowedHosts.includes(urlObj.hostname) && urlObj.protocol === 'http:';
  } catch {
    return false;
  }
};

const defaultUrl = 'http://localhost:8000/api';
const envUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL = envUrl || defaultUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 5000
});

// Helper to set authentication token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['X-Auth-Token'] = token;
    sessionStorage.setItem('authToken', token);
  } else {
    delete api.defaults.headers.common['X-Auth-Token'];
    sessionStorage.removeItem('authToken');
  }
};

// Helper to set admin header
export const setAdminHeader = (isAdmin) => {
  if (isAdmin) {
    api.defaults.headers.common['X-Is-Admin'] = 'true';
  } else {
    delete api.defaults.headers.common['X-Is-Admin'];
  }
};

// Restore auth token from sessionStorage on page load
const storedToken = sessionStorage.getItem('authToken');
if (storedToken) {
  api.defaults.headers.common['X-Auth-Token'] = storedToken;
}

export const authAPI = {
  verifyPin: (pin) => api.post('/auth/verify-pin', { pin }),
  logout: () => api.post('/auth/logout')
}

export const approvalAPI = {
  getPendingEdits: () => api.get('/pending-edits'),
  approve: (id) => api.post(`/pending-edits/${id}/approve`),
  reject: (id) => api.post(`/pending-edits/${id}/reject`),
  createPendingEdit: (data) => api.post('/pending-edits', data),
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
  claim: (id, data) => {
    const validId = /^[0-9]+$/.test(id) ? id : null;
    if (!validId) throw new Error('Invalid item ID');
    return api.post(`/items/${validId}/claim`, data);
  },
  
  // Get items to be cleared
  getItemsToBeCleared: () => api.get('/items-to-be-cleared'),
};

export default api;