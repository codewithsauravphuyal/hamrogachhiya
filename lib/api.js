import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token but don't redirect automatically
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('Authentication failed - user can decide where to go');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products', { params: { featured: true } }),
};

// Categories API
export const categoriesAPI = {
  getAll: (params = {}) => api.get('/categories', { params }),
  getByLevel: (level) => api.get('/categories', { params: { level } }),
  getActive: () => api.get('/categories', { params: { active: true } }),
};

// Stores API
export const storesAPI = {
  getAll: (params = {}) => api.get('/stores', { params }),
  getById: (id) => api.get(`/stores/${id}`),
  getVerified: () => api.get('/stores', { params: { verified: true } }),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  addItem: (item) => api.post('/cart', item),
  updateItem: (productId, quantity) => api.put('/cart', { productId, quantity }),
  removeItem: (productId) => api.delete(`/cart?productId=${productId}`),
  clear: () => api.delete('/cart'),
};

// Orders API
export const ordersAPI = {
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getAddresses: () => api.get('/user/addresses'),
  addAddress: (address) => api.post('/user/addresses', address),
  updateAddress: (id, address) => api.put(`/user/addresses/${id}`, address),
  deleteAddress: (id) => api.delete(`/user/addresses/${id}`),
};

// Utility functions
export const apiUtils = {
  handleError: (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    return { error: message };
  },
  
  handleSuccess: (response) => {
    return response.data;
  },
};

export default api; 