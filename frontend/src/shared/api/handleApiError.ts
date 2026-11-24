import { isAxiosError } from "axios";

// Convierte el detail de la API en un mensaje para mostrar en pantalla
export function handleApiError(error: unknown, porDefecto: string): string {
  if (isAxiosError(error) && typeof error.response?.data?.detail === "string") {
    return error.response.data.detail;
  }
  return porDefecto;
}