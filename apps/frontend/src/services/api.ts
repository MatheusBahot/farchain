import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@store/authStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de request — adicionar Bearer token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de response — refresh automático
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('farchain-refresh');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken } = data.data;

        useAuthStore.getState().updateToken(accessToken);
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ============================================================
// Funções de API
// ============================================================

export const authApi = {
  login: (email: string, senha: string) =>
    api.post('/auth/login', { email, senha }).then((r) => r.data.data),
  logout: () => api.post('/auth/logout'),
  perfil: () => api.get('/auth/perfil').then((r) => r.data.data),
};

export const medicamentosApi = {
  listar: (params?: any) => api.get('/medicamentos', { params }).then((r) => r.data.data),
  buscarPorId: (id: string) => api.get(`/medicamentos/${id}`).then((r) => r.data.data),
  criar: (data: any) => api.post('/medicamentos', data).then((r) => r.data.data),
  atualizar: (id: string, data: any) => api.put(`/medicamentos/${id}`, data).then((r) => r.data.data),
  estatisticas: () => api.get('/medicamentos/estatisticas').then((r) => r.data.data),
};

export const lotesApi = {
  listar: (params?: any) => api.get('/lotes', { params }).then((r) => r.data.data),
  buscarPorId: (id: string) => api.get(`/lotes/${id}`).then((r) => r.data.data),
  criar: (data: any) => api.post('/lotes', data).then((r) => r.data.data),
  vencimentos: (dias?: number) => api.get('/lotes/vencimentos', { params: { dias } }).then((r) => r.data.data),
  rastreio: (hash: string) => api.get(`/lotes/rastreio/${hash}`).then((r) => r.data.data),
};

export const movimentacoesApi = {
  listar: (params?: any) => api.get('/movimentacoes', { params }).then((r) => r.data.data),
  criar: (data: any) => api.post('/movimentacoes', data).then((r) => r.data.data),
};

export const dispensacoesApi = {
  listar: (params?: any) => api.get('/dispensacoes', { params }).then((r) => r.data.data),
  dispensar: (data: any) => api.post('/dispensacoes', data).then((r) => r.data.data),
  estatisticas: () => api.get('/dispensacoes/estatisticas').then((r) => r.data.data),
};

export const blockchainApi = {
  listarBlocos: (params?: any) => api.get('/blockchain/blocos', { params }).then((r) => r.data.data),
  validar: () => api.get('/blockchain/validar').then((r) => r.data.data),
  historicoLote: (loteId: string) => api.get(`/blockchain/lote/${loteId}`).then((r) => r.data.data),
};

export const dashboardApi = {
  resumo: () => api.get('/dashboard/resumo').then((r) => r.data.data),
  dispensacoesMes: () => api.get('/dashboard/dispensacoes-por-mes').then((r) => r.data.data),
  topMedicamentos: () => api.get('/dashboard/top-medicamentos').then((r) => r.data.data),
  alertas: () => api.get('/dashboard/alertas').then((r) => r.data.data),
};

export const farmacovigilanciaApi = {
  listar: (params?: any) => api.get('/farmacovigilancia', { params }).then((r) => r.data.data),
  registrar: (data: any) => api.post('/farmacovigilancia', data).then((r) => r.data.data),
  estatisticas: () => api.get('/farmacovigilancia/estatisticas').then((r) => r.data.data),
};

export const qrCodeApi = {
  gerar: (loteId: string) => api.post(`/qrcode/lote/${loteId}`).then((r) => r.data.data),
  consultar: (hash: string) => api.get(`/qrcode/consultar/${hash}`).then((r) => r.data.data),
};

export const unidadesApi = {
  listar: (busca?: string) => api.get('/unidades', { params: { busca } }).then((r) => r.data.data),
  buscarPorId: (id: string) => api.get(`/unidades/${id}`).then((r) => r.data.data),
};

export const distritosApi = {
  listar: () => api.get('/distritos').then((r) => r.data.data),
};
