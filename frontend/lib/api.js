import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const productApi = {
  list: (params) => api.get('/products', { params }),
  get: (idOrSlug) => api.get(`/products/${idOrSlug}`),
  review: (id, data) => api.post(`/products/${id}/reviews`, data),
  adminList: () => api.get('/products/admin/all'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
};

export const orderApi = {
  create: (data) => api.post('/orders', data),
  my: () => api.get('/orders/my'),
  get: (id) => api.get(`/orders/${id}`),
  adminList: () => api.get('/orders'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const categoryApi = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
};

export const chatApi = {
  getMyConversation: (productId) => api.get(`/chat/${productId}`),
  sendMessage: (productId, text) => api.post(`/chat/${productId}`, { text }),
  sellerList: () => api.get('/chat/conversations'),
  sellerGet: (id) => api.get(`/chat/conversations/${id}`),
  sellerReply: (id, text) => api.post(`/chat/conversations/${id}/reply`, { text }),
};

export default api;
