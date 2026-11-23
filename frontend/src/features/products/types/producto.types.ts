export interface CategoriaDeProducto {
  id: number;
  nombre: string;
  es_principal: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  imagenes_url: string[];
  disponible: boolean;
  categorias: CategoriaDeProducto[];
}

export type ProductoInput = Omit<Producto, "id" | "categorias">;