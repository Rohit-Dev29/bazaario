import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach the saved login token to every request as a backup to cookies —
// some mobile browsers block cross-site cookies (our site and API are on
// different domains), so this keeps login working everywhere.
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('bazaario_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

function saveToken(response) {
  if (typeof window !== 'undefined' && response?.data?.token) {
    window.localStorage.setItem('bazaario_token', response.data.token);
  }
  return response;
}

function clearToken() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('bazaario_token');
  }
}

export const authApi = {
  register: (data) => api.post('/auth/register', data).then(saveToken),
  login: (data) => api.post('/auth/login', data).then(saveToken),
  logout: () => api.post('/auth/logout').finally(clearToken),
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