import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/account` : 'http://localhost:8000/api/account';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const accountAPI = {
  // Profile
  getProfile: () => api.get('/profile.php'),
  updateProfile: (data) => api.post('/update-profile.php', data),
  uploadAvatar: (formData) => {
    return api.post('/upload-avatar.php', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Orders
  getOrders: () => api.get('/orders.php'),
  getOrderDetails: (orderId) => api.get(`/order-details.php?id=${orderId}`),

  // Addresses
  getAddresses: () => api.get('/addresses.php'),
  createAddress: (data) => api.post('/address-create.php', data),
  updateAddress: (data) => api.post('/address-update.php', data),
  deleteAddress: (id) => api.post('/address-delete.php', { id }),
  setDefaultAddress: (id) => api.post('/address-set-default.php', { id }),

  // Wishlist
  getWishlist: () => api.get('/wishlist.php'),
  addToWishlist: (productId) => api.post('/wishlist-add.php', { product_id: productId }),
  removeFromWishlist: (productId) => api.post('/wishlist-remove.php', { product_id: productId }),
  checkWishlist: (productId) => api.get(`/wishlist-check.php?product_id=${productId}`),

  // Settings
  getSettings: () => api.get('/settings.php'),
  updateSettings: (data) => api.post('/settings.php', data),

  // Password
  changePassword: (data) => api.post('/change-password.php', data),
};

export default accountAPI;
