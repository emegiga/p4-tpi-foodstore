import axios from "axios";

// instancia de Axios compartida por todas las features
export const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, // el navegador envía la cookie HttpOnly en cada petición
});
