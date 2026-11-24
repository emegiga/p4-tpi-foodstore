import { axiosInstance } from "@/shared/api/axiosInstance";
import type { Categoria, CategoriaInput } from "../types/categoria.types";

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await axiosInstance.get<Categoria[]>("/categorias");
  return data;
}

export async function crearCategoria(categoria: CategoriaInput): Promise<Categoria> {
  const { data } = await axiosInstance.post<Categoria>("/categorias", categoria);
  return data;
}

export async function actualizarCategoria(id: number, categoria: CategoriaInput): Promise<Categoria> {
  const { data } = await axiosInstance.put<Categoria>(`/categorias/${id}`, categoria);
  return data;
}

export async function eliminarCategoria(id: number): Promise<void> {
  await axiosInstance.delete(`/categorias/${id}`);
}
