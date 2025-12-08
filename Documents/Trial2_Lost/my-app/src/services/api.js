import axios from 'axios';

// Validate and restrict API base URL to prevent SSRF
const validateApiUrl = (url) => {
  const allowedHosts = ['localhost', '127.0.0.1', 'trial-v1-syv7.onrender.com'];
  try {
    const urlObj = new URL(url);
    return allowedHosts.includes(urlObj.hostname) && (urlObj.protocol === 'http:' || urlObj.protocol === 'https:');
  } catch {
    return false;
  }
};

const defaultUrl = 'https://trial-v1-syv7.onrender.com/api';
const envUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL = envUrl || defaultUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000 // Increased to 30 seconds for slow backend responses (e.g., cold starts on Render)
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
  reject: (id, data) => api.post(`/pending-edits/${id}/reject`, data),
  createPendingEdit: (data) => api.post('/pending-edits', data),
};

export const itemsAPI = {
  // Get all items (with pagination support)
  getAll: (params = {}) => {
    const { page = 1, per_page = 50 } = params;
    return api.get('/items', { params: { page, per_page } });
  },

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

  // Get items to be cleared (with pagination support)
  getItemsToBeCleared: (params = {}) => {
    const { page = 1, per_page = 50 } = params;
    return api.get('/items-to-be-cleared', { params: { page, per_page } });
  },

  // Get rejection comments for an item
  getRejectionComments: (itemId) => api.get(`/items/${itemId}/rejection-comments`),

  // Get history (with pagination support)
  getHistory: (params = {}) => {
    const { page = 1, per_page = 50 } = params;
    return api.get('/history', { params: { page, per_page } });
  },
};

export default api;