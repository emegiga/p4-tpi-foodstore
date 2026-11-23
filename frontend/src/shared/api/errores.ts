import { isAxiosError } from "axios";

export function mensajeError(error: unknown, porDefecto: string) {
  if (isAxiosError(error) && typeof error.response?.data?.detail === "string") {
    return error.response.data.detail as string;
  }
  return porDefecto;
}

// los hooks  usan el 403 para no repetir el toast
export function es403(error: unknown) {
  return isAxiosError(error) && error.response?.status === 403;
}