import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('farchain-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  logout: () => api.post('/auth/logout'),

  perfil: () => api.get('/auth/perfil'),
};

export const qrCodeApi = {
  consultar: (hash: string) => api.get(`/qrcode/consultar/${hash}`),
  gerarLote: (loteId: string) => api.post(`/qrcode/lote/${loteId}`),
};

export default api;
