import { axiosInstance } from "@/shared/api/axiosInstance";
import type { RegisterData, Usuario } from "../types/auth.types";

export async function login(username: string, password: string): Promise<void> {
  // el backend espera un formulario OAuth2 y responde con la cookie HttpOnly
  await axiosInstance.post("/auth/token", new URLSearchParams({ username, password }));
}

export async function logout(): Promise<void> {
  await axiosInstance.post("/auth/logout");
}

export async function getMe(): Promise<Usuario> {
  const { data } = await axiosInstance.get<Usuario>("/auth/me");
  return data;
}

export async function registrar(datos: RegisterData): Promise<Usuario> {
  const { data } = await axiosInstance.post<Usuario>("/auth/register", datos);
  return data;
}