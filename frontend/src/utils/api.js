import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Leads API
export const leadsAPI = {
  getAll: () => api.get('/leads'),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`)
};

// Clients API
export const clientsAPI = {
  getAll: () => api.get('/clients'),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`)
};

// Expenses API
export const expensesAPI = {
  getAll: () => api.get('/expenses'),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`)
};

// Development API
export const developmentAPI = {
  getAll: () => api.get('/development'),
  create: (data) => api.post('/development', data),
  update: (id, data) => api.put(`/development/${id}`, data),
  delete: (id) => api.delete(`/development/${id}`)
};

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`)
};

// Messages API
export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (conversationId) => api.get(`/messages/conversation/${conversationId}`),
  sendMessage: (data) => api.post('/messages', data),
  getUsers: () => api.get('/messages/users')
};

export const uploadAPI = {
  uploadProfilePhoto: (formData) => api.post('/upload-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getData: () => api.get('/analytics/data')
};

export default api;