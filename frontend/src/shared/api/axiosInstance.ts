import axios from "axios";
import { useAuthStore } from "@/store/authStore";

// Cliente HTTP único de la aplicación
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // el navegador envía la cookie HttpOnly en cada petición
});

// Peticiones que responden 401 como parte de su funcionamiento normal
const RUTAS_DE_AUTH = ["/auth/token", "/auth/me"];

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? "";
    const status: number | undefined = error.response?.status;
    const detail: unknown = error.response?.data?.detail;

    const sesionVencida = status === 401 && !RUTAS_DE_AUTH.some((ruta) => url.includes(ruta));
    const cuentaDesactivada = status === 400 && detail === "Cuenta de usuario desactivada";

    // se limpia la sesión y ProtectedRoute lleva al login
    if (sesionVencida || cuentaDesactivada) {
      useAuthStore.getState().limpiarSesion();
    }
    return Promise.reject(error);
  },
);