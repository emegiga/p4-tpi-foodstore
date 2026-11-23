import { useMutation } from "@tanstack/react-query";
import { registrarUsuario } from "../services/usuario.service";
import { useAuthStore } from "../store/authStore";

// inicio/cierre de sesión
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const isAdmin = useAuthStore((state) => state.hasRole("admin"));
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const register = useMutation({ mutationFn: registrarUsuario });

  return { user, status, isAdmin, login, logout, register };
}
