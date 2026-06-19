import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/admin` : 'http://localhost:8000/api/admin';

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dashboard
export const dashboardAPI = {
  getStats: () => adminApi.get('/stats.php'),
};

// Products
export const productsAPI = {
  getAll: (params) => adminApi.get('/products.php', { params }),
  create: (data) => adminApi.post('/product-create.php', data),
  update: (data) => adminApi.post('/product-update.php', data),
  delete: (productId) => adminApi.post('/product-delete.php', { product_id: productId }),
  uploadImage: (formData) => adminApi.post('/upload-image.php', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Orders
export const ordersAPI = {
  getAll: (params) => adminApi.get('/orders.php', { params }),
  getById: (id) => adminApi.get(`/orders.php?id=${id}`),
  updateStatus: (orderId, status) => adminApi.post('/order-status.php', { order_id: orderId, status }),
};

// Users
export const usersAPI = {
  getAll: (params) => adminApi.get('/users.php', { params }),
  updateRole: (userId, role) => adminApi.post('/user-role.php', { user_id: userId, role }),
  delete: (userId) => adminApi.post('/user-delete.php', { user_id: userId }),
};

// Categories
export const categoriesAPI = {
  getAll: () => adminApi.get('/categories.php'),
  create: (data) => adminApi.post('/category-create.php', data),
  update: (data) => adminApi.post('/category-update.php', data),
  delete: (categoryId) => adminApi.post('/category-delete.php', { category_id: categoryId }),
};

// Contacts
export const contactsAPI = {
  getAll: (params) => adminApi.get('/contacts.php', { params }),
  updateStatus: (contactId, status) => adminApi.post('/contact-resolve.php', { contact_id: contactId, status }),
};

export default adminApi;
