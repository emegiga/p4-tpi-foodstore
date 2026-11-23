export type Role = "user" | "admin";

export interface UsuarioAuth {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  roles: string[];
}

// lo que devuelve el backend en /auth/me y en /auth/admin/usuarios
export interface UsuarioPublico extends UsuarioAuth {
  celular: string | null;
  activo: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  password: string;
}