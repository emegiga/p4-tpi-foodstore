import { Navigate, Outlet } from "react-router-dom";
import type { Role } from "@/features/auth/types/auth.types";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  allowedRoles?: Role[]; // sin roles: alcanza con tener sesión
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const usuario = useAuthStore((s) => s.usuario);
  const cargando = useAuthStore((s) => s.cargando);

  // mientras checkSession confirma la sesión no se redirige
  if (cargando) return <p className="py-6 text-gray-500">Verificando sesión...</p>;

  if (!usuario) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(usuario.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;