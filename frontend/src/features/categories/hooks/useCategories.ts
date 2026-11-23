import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { es403, mensajeError } from "@/shared/api/errores";
import { useNotificationStore } from "@/store/notificationStore";
import {
  createCategoria,
  deleteCategoria,
  getCategorias,
  updateCategoria,
} from "../services/categoria.service";
import type { Categoria, CategoriaInput } from "../types/categoria.types";

const SIN_CATEGORIAS: Categoria[] = []; // referencia fija mientras carga (TanStack Table)

// CRUD de categorias: encapsula Axios (services) y TanStack Query
export function useCategories() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  const query = useQuery({ queryKey: ["categorias"], queryFn: getCategorias });

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["categorias"] });

  const onError = (error: unknown) => {
    if (es403(error)) return; // el 403 ya lo avisa el interceptor
    showNotification(mensajeError(error, "No se pudo completar la operación"));
  };

  const crear = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => {
      invalidar();
      showNotification("Categoría creada");
    },
    onError,
  });

  const editar = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaInput }) => updateCategoria(id, data),
    onSuccess: () => {
      invalidar();
      showNotification("Categoría actualizada");
    },
    onError,
  });

  const eliminar = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => {
      invalidar();
      showNotification("Categoria eliminada");
    },
    onError,
  });

  return {
    categorias: query.data ?? SIN_CATEGORIAS,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    crear,
    editar,
    eliminar,
  };
}
