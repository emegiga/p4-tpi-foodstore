import { api } from "@/shared/api/api";
import type { RegisterData, UsuarioPublico } from "../types/auth.types";

export async function registrarUsuario(datos: RegisterData) {
  const { data } = await api.post<UsuarioPublico>("/auth/register", datos);
  return data;
}

export async function getUsuarios() {
  const { data } = await api.get<UsuarioPublico[]>("/auth/admin/usuarios");
  return data;
}

export async function activarUsuario(id: number) {
  await api.post(`/auth/admin/usuarios/${id}/activar`);
}

export async function desactivarUsuario(id: number) {
  await api.post(`/auth/admin/usuarios/${id}/desactivar`);
}