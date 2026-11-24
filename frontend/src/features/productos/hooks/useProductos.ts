import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  actualizarProducto,
  cambiarStock,
  crearProducto,
  eliminarProducto,
  getProductos,
} from "../api/productos";
import type { FiltrosProductos, ProductoInput, StockInput } from "../types/producto.types";

export function useProductos(filtros: FiltrosProductos) {
  return useQuery({ queryKey: ["productos", filtros], queryFn: () => getProductos(filtros) });
}

export function useProductoMutations() {
  const queryClient = useQueryClient();
  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["productos"] });

  const crear = useMutation({ mutationFn: crearProducto, onSuccess: invalidar });

  const editar = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoInput }) => actualizarProducto(id, data),
    onSuccess: invalidar,
  });

  const actualizarStock = useMutation({
    mutationFn: ({ id, data }: { id: number; data: StockInput }) => cambiarStock(id, data),
    onSuccess: invalidar,
  });

  const eliminar = useMutation({ mutationFn: eliminarProducto, onSuccess: invalidar });

  return { crear, editar, actualizarStock, eliminar };
}