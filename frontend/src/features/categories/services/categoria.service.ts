import { api } from "@/shared/api/api";
import type { Categoria, CategoriaInput } from "../types/categoria.types";

export async function getCategorias() {
  const { data } = await api.get<Categoria[]>("/categorias/");
  return data;
}

export async function createCategoria(categoria: CategoriaInput) {
  const { data } = await api.post<Categoria>("/categorias/", categoria);
  return data;
}

export async function updateCategoria(id: number, categoria: CategoriaInput) {
  const { data } = await api.put<Categoria>(`/categorias/${id}`, categoria);
  return data;
}

export async function deleteCategoria(id: number) {
  await api.delete(`/categorias/${id}`);
}