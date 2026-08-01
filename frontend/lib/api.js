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
};

export const orderApi = {
  create: (data) => api.post('/orders', data),
  my: () => api.get('/orders/my'),
  get: (id) => api.get(`/orders/${id}`),
};

export const categoryApi = {
  list: () => api.get('/categories'),
};

export default api;
