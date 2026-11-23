import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { es403, mensajeError } from "@/shared/api/errores";
import { useNotificationStore } from "@/store/notificationStore";
import { activarUsuario, desactivarUsuario, getUsuarios } from "../services/usuario.service";
import type { UsuarioPublico } from "../types/auth.types";

const SIN_USUARIOS: UsuarioPublico[] = [];

// gestion de usuarios (listar, activar, desactivar)
export function useUsers() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  const query = useQuery({ queryKey: ["usuarios"], queryFn: getUsuarios });

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["usuarios"] });

  const onError = (error: unknown) => {
    if (es403(error)) return; // el 403 ya lo avisa el interceptor
    showNotification(mensajeError(error, "No se pudo cambiar el estado"));
  };

  const activar = useMutation({
    mutationFn: activarUsuario,
    onSuccess: () => {
      invalidar();
      showNotification("Usuario activado");
    },
    onError,
  });

  const desactivar = useMutation({
    mutationFn: desactivarUsuario,
    onSuccess: () => {
      invalidar();
      showNotification("Usuario desactivado");
    },
    onError,
  });

  return {
    usuarios: query.data ?? SIN_USUARIOS,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    activar,
    desactivar,
  };
}
