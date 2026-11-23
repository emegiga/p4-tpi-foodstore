// API pública de la feature auth
export { useAuthStore } from "./store/authStore";
export { useAuth } from "./hooks/useAuth";
export { default as LoginPage } from "./pages/LoginPage";
export { default as RegisterPage } from "./pages/RegisterPage";
export { default as AdminUsersPage } from "./pages/AdminUsersPage";
export type { Role, UsuarioAuth } from "./types/auth.types";
