import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { es403, mensajeError } from "@/shared/api/errores";
import { useNotificationStore } from "@/store/notificationStore";
import {
  createIngrediente,
  deleteIngrediente,
  getIngredientes,
  updateIngrediente,
} from "../services/ingrediente.service";
import type { Ingrediente, IngredienteInput } from "../types/ingrediente.types";

const SIN_INGREDIENTES: Ingrediente[] = []; // referencia fija mientras carga (TanStack Table)

// CRUD de ingredientes: encapsula Axios (services) y TanStack Query
export function useIngredients() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  const query = useQuery({ queryKey: ["ingredientes"], queryFn: getIngredientes });

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["ingredientes"] });

  const onError = (error: unknown) => {
    if (es403(error)) return; // el 403 ya lo avisa el interceptor
    showNotification(mensajeError(error, "No se pudo completar la operacion"));
  };

  const crear = useMutation({
    mutationFn: createIngrediente,
    onSuccess: () => {
      invalidar();
      showNotification("Ingrediente creado");
    },
    onError,
  });

  const editar = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredienteInput }) => updateIngrediente(id, data),
    onSuccess: () => {
      invalidar();
      showNotification("Ingrediente actualizado");
    },
    onError,
  });

  const eliminar = useMutation({
    mutationFn: deleteIngrediente,
    onSuccess: () => {
      invalidar();
      showNotification("Ingrediente eliminado");
    },
    onError,
  });

  return {
    ingredientes: query.data ?? SIN_INGREDIENTES,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    crear,
    editar,
    eliminar,
  };
}
