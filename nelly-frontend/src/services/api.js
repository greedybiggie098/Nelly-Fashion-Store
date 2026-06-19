import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/register.php', data),
  login: (data) => api.post('/login.php', data),
  logout: () => api.post('/logout.php'),
  checkAuth: () => api.get('/check-auth.php'),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products.php', { params }),
  getById: (id) => api.get(`/product.php?id=${id}`),
  getBySlug: (slug) => api.get(`/product.php?slug=${slug}`),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart.php'),
  add: (data) => api.post('/cart-add.php', data),
  update: (data) => api.post('/cart-update.php', data),
  remove: (itemId) => api.post('/cart-remove.php', { item_id: itemId }),
};

// Orders API
export const ordersAPI = {
  create: (data) => api.post('/checkout.php', data),
  getAll: () => api.get('/orders.php'),
  getById: (id) => api.get(`/orders.php?id=${id}`),
};

// Contact API
export const contactAPI = {
  send: (data) => api.post('/contact.php', data),
};

// Payment API
export const paymentAPI = {
  verify: (reference) => api.post('/payment-verify.php', { reference }),
};

export default api;
