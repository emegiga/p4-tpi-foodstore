import { api } from "./api";
import { useAuthStore } from "@/features/auth";
import { useNotificationStore } from "@/store/notificationStore";

// peticiones que responden 401 como parte de su funcionamiento normal
const RUTAS_DE_AUTH = ["/auth/token", "/auth/me"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? "";
    const status = error.response?.status;

    // 401: sesión vencida -> se limpia el store y ProtectedRoute lleva al login
    if (status === 401 && !RUTAS_DE_AUTH.some((ruta) => url.includes(ruta))) {
      useAuthStore.setState({ user: null, status: "unauthenticated" });
    }

    // 403: sesión válida sin permisos -> aviso, sin cerrar sesion
    if (status === 403) {
      useNotificationStore.getState().showNotification("Acceso denegado");
    }

    return Promise.reject(error);
  },
);
