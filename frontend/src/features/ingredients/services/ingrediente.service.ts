import { api } from "@/shared/api/api";
import type { Ingrediente, IngredienteInput } from "../types/ingrediente.types";

export async function getIngredientes() {
  const { data } = await api.get<Ingrediente[]>("/ingredientes/");
  return data;
}

export async function createIngrediente(ingrediente: IngredienteInput) {
  const { data } = await api.post<Ingrediente>("/ingredientes/", ingrediente);
  return data;
}

export async function updateIngrediente(id: number, ingrediente: IngredienteInput) {
  const { data } = await api.put<Ingrediente>(`/ingredientes/${id}`, ingrediente);
  return data;
}

export async function deleteIngrediente(id: number) {
  await api.delete(`/ingredientes/${id}`);
}
