import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { actualizarCategoria, crearCategoria, eliminarCategoria, getCategorias } from "../api/categorias";
import type { CategoriaInput } from "../types/categoria.types";

export function useCategorias() {
  return useQuery({ queryKey: ["categorias"], queryFn: getCategorias });
}

export function useCategoriaMutations() {
  const queryClient = useQueryClient();
  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["categorias"] });

  const crear = useMutation({ mutationFn: crearCategoria, onSuccess: invalidar });

  const editar = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaInput }) => actualizarCategoria(id, data),
    onSuccess: invalidar,
  });

  const eliminar = useMutation({ mutationFn: eliminarCategoria, onSuccess: invalidar });

  return { crear, editar, eliminar };
}
