import { axiosInstance } from "@/shared/api/axiosInstance";
import type {
  FiltrosProductos,
  Producto,
  ProductoInput,
  ProductosPaginados,
  StockInput,
} from "../types/producto.types";

export async function getProductos(filtros: FiltrosProductos): Promise<ProductosPaginados> {
  const { data } = await axiosInstance.get<ProductosPaginados>("/productos", { params: filtros });
  return data;
}

export async function crearProducto(producto: ProductoInput): Promise<Producto> {
  const { data } = await axiosInstance.post<Producto>("/productos", producto);
  return data;
}

export async function actualizarProducto(id: number, producto: ProductoInput): Promise<Producto> {
  const { data } = await axiosInstance.put<Producto>(`/productos/${id}`, producto);
  return data;
}

export async function cambiarStock(id: number, stock: StockInput): Promise<Producto> {
  const { data } = await axiosInstance.patch<Producto>(`/productos/${id}/stock`, stock);
  return data;
}

export async function eliminarProducto(id: number): Promise<void> {
  await axiosInstance.delete(`/productos/${id}`);
}
