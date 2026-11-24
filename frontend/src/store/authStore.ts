import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as authApi from "@/features/auth/api/auth";
import type { Usuario } from "@/features/auth/types/auth.types";

interface AuthState {
  usuario: Usuario | null;
  cargando: boolean; // true mientras checkSession confirma la sesión
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  limpiarSesion: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,

      login: async (username, password) => {
        await authApi.login(username, password);
        const usuario = await authApi.getMe();
        set({ usuario });
      },

      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          set({ usuario: null });
        }
      },

      // se llama al montar la aplicación: confirma con /auth/me que la cookie sigue vigente
      checkSession: async () => {
        set({ cargando: true });
        try {
          const usuario = await authApi.getMe();
          set({ usuario });
        } catch {
          set({ usuario: null });
        } finally {
          set({ cargando: false });
        }
      },

      limpiarSesion: () => set({ usuario: null }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ usuario: state.usuario }), // solo el usuario, nunca el token
    },
  ),
);