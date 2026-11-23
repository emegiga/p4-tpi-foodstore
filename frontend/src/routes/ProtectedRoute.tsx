import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import type { Role } from "@/features/auth";
import Loading from "@/shared/components/Loading";

interface ProtectedRouteProps {
  allowedRoles?: Role[]; // sin roles: alcanza con estar autenticado
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const status = useAuthStore((state) => state.status);
  const hasRole = useAuthStore((state) => state.hasRole);

  // mientras se confirma la sesión con /auth/me no se redirige
  if (status === "checking") return <Loading mensaje="Verificando sesión..." />;

  // sin sesión: al login
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  // con sesión pero sin el rol requerido
  if (allowedRoles && !hasRole(...allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
