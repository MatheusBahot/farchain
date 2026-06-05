import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@store/authStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      useAuthStore.getState().accessToken ||
      localStorage.getItem('farchain-token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);

const unwrap = (r: any) => r.data?.data ?? r.data;

export const authApi = {
  login: async (email: string, senha: string) => {
    const response = await api.post('/auth/login', { email, password: senha });
    return unwrap(response);
  },

  logout: () => api.post('/auth/logout').catch(() => {}),

  perfil: () => api.get('/auth/perfil').then(unwrap),
};

export const medicamentosApi = {
  listar: (params?: any) => api.get('/medicamentos', { params }).then(unwrap),
  buscarPorId: (id: string) => api.get(`/medicamentos/${id}`).then(unwrap),
  criar: (data: any) => api.post('/medicamentos', data).then(unwrap),
  atualizar: (id: string, data: any) => api.put(`/medicamentos/${id}`, data).then(unwrap),
  estatisticas: () => api.get('/medicamentos/estatisticas').then(unwrap),
};

export const lotesApi = {
  listar: (params?: any) => api.get('/lotes', { params }).then(unwrap),
  buscarPorId: (id: string) => api.get(`/lotes/${id}`).then(unwrap),
  criar: (data: any) => api.post('/lotes', data).then(unwrap),
  vencimentos: (dias?: number) => api.get('/lotes/vencimentos', { params: { dias } }).then(unwrap),
  rastreio: (hash: string) => api.get(`/lotes/rastreio/${hash}`).then(unwrap),
  atualizarStatus: (id: string, status: string) => api.patch(`/lotes/${id}/status`, { status }).then(unwrap),
};

export const movimentacoesApi = {
  listar: (params?: any) => api.get('/movimentacoes', { params }).then(unwrap),
  criar: (data: any) => api.post('/movimentacoes', data).then(unwrap),
};

export const dispensacoesApi = {
  listar: (params?: any) => api.get('/dispensacoes', { params }).then(unwrap),
  dispensar: (data: any) => api.post('/dispensacoes', data).then(unwrap),
  estatisticas: () => api.get('/dispensacoes/estatisticas').then(unwrap),
};

export const blockchainApi = {
  listarBlocos: (params?: any) => api.get('/blockchain/blocos', { params }).then(unwrap),
  validar: () => api.get('/blockchain/validar').then(unwrap),
  historicoLote: (loteId: string) => api.get(`/blockchain/lote/${loteId}`).then(unwrap),
};

export const dashboardApi = {
  resumo: () => api.get('/dashboard/resumo').then(unwrap),
  dispensacoesMes: () => api.get('/dashboard/dispensacoes-por-mes').then(unwrap),
  topMedicamentos: () => api.get('/dashboard/top-medicamentos').then(unwrap),
  alertas: () => api.get('/dashboard/alertas').then(unwrap),
};

export const farmacovigilanciaApi = {
  listar: (params?: any) => api.get('/farmacovigilancia', { params }).then(unwrap),
  registrar: (data: any) => api.post('/farmacovigilancia', data).then(unwrap),
  estatisticas: () => api.get('/farmacovigilancia/estatisticas').then(unwrap),
};

export const qrCodeApi = {
  gerar: (loteId: string) => api.post(`/qrcode/lote/${loteId}`).then(unwrap),
  consultar: (hash: string) => api.get(`/qrcode/consultar/${hash}`).then(unwrap),
};

export const unidadesApi = {
  listar: (busca?: string) => api.get('/unidades', { params: { busca } }).then(unwrap),
  buscarPorId: (id: string) => api.get(`/unidades/${id}`).then(unwrap),
  criar: (data: any) => api.post('/unidades', data).then(unwrap),
};

export const distritosApi = {
  listar: () => api.get('/distritos').then(unwrap),
};
