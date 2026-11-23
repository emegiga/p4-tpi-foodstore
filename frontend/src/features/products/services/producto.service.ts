import { api } from "@/shared/api/api";
import type { Producto, ProductoInput } from "../types/producto.types";

export async function getProductos() {
  const { data } = await api.get<Producto[]>("/productos/");
  return data;
}

export async function createProducto(producto: ProductoInput) {
  const { data } = await api.post<Producto>("/productos/", producto);
  return data;
}

export async function updateProducto(id: number, producto: ProductoInput) {
  const { data } = await api.put<Producto>(`/productos/${id}`, producto);
  return data;
}

export async function deleteProducto(id: number) {
  await api.delete(`/productos/${id}`);
}