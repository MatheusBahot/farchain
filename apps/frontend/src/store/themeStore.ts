import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (v: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      darkMode: true,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setDarkMode: (v) => set({ darkMode: v }),
    }),
    {
      name: 'farchain-theme',
      // Sempre iniciar com dark: true se não houver preferência salva
      onRehydrateStorage: () => (state) => {
        if (state && state.darkMode === undefined) {
          state.darkMode = true;
        }
      },
    },
  ),
);
