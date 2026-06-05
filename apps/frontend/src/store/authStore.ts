import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
  unidadeId?: string;
  avatarUrl?: string;
}

interface AuthState {
  usuario: Usuario | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (usuario: Usuario, accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  updateToken: (accessToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (usuario, accessToken, refreshToken = null as any) =>
        set({
          usuario,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      logout: () => {
        localStorage.removeItem('farchain-token');
        localStorage.removeItem('farchain-refresh');
        set({
          usuario: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateToken: (accessToken) =>
        set({
          accessToken,
          isAuthenticated: true,
        }),
    }),
    {
      name: 'farchain-auth',
      partialize: (state) => ({
        usuario: state.usuario,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
