// Mismos campos que CategoriaRead del backend
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface CategoriaInput {
  nombre: string;
  descripcion: string;
}
