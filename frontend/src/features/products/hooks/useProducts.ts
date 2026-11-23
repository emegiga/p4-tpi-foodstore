import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { es403, mensajeError } from "@/shared/api/errores";
import { useNotificationStore } from "@/store/notificationStore";
import {
  createProducto,
  deleteProducto,
  getProductos,
  updateProducto,
} from "../services/producto.service";
import type { Producto, ProductoInput } from "../types/producto.types";

const SIN_PRODUCTOS: Producto[] = []; // referencia fija mientras carga (TanStack Table)

// CRUD de productos: encapsula Axios (services) y TanStack Query
export function useProducts() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  const query = useQuery({ queryKey: ["productos"], queryFn: getProductos });

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["productos"] });

  const onError = (error: unknown) => {
    if (es403(error)) return; // el 403 ya lo avisa el interceptor
    showNotification(mensajeError(error, "No se pudo completar la operación"));
  };

  const crear = useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      invalidar();
      showNotification("Producto creado");
    },
    onError,
  });

  const editar = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoInput }) => updateProducto(id, data),
    onSuccess: () => {
      invalidar();
      showNotification("Producto actualizado");
    },
    onError,
  });

  const eliminar = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      invalidar();
      showNotification("Producto eliminado");
    },
    onError,
  });

  return {
    productos: query.data ?? SIN_PRODUCTOS,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    crear,
    editar,
    eliminar,
  };
}
