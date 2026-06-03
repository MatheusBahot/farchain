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
  isAuthenticated: boolean;
  setAuth: (usuario: Usuario, token: string) => void;
  logout: () => void;
  updateToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (usuario, accessToken) =>
        set({ usuario, accessToken, isAuthenticated: true }),

      logout: () =>
        set({ usuario: null, accessToken: null, isAuthenticated: false }),

      updateToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: 'farchain-auth',
      partialize: (state) => ({
        usuario: state.usuario,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
