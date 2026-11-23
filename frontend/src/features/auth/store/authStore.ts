import { create } from "zustand";
import { api } from "@/shared/api/api";
import type { Role, UsuarioAuth } from "../types/auth.types";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthState {
  user: UsuarioAuth | null;
  status: AuthStatus;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (...roles: Role[]) => boolean;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  status: "checking", 

  checkAuth: async () => {
    try {
      const { data } = await api.get<UsuarioAuth>("/auth/me");
      set({ user: data, status: "authenticated" });
    } catch {
      set({ user: null, status: "unauthenticated" });
    }
  },

  login: async (email, password) => {
    await api.post("/auth/token", new URLSearchParams({ username: email, password }));
    await get().checkAuth();
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null, status: "unauthenticated" });
    }
  },

  hasRole: (...roles) => {
    const user = get().user;
    return user !== null && user.roles.some((rol) => roles.includes(rol as Role));
  },
}));
