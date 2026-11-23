import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { mensajeError } from "@/shared/api/errores";
import CampoTexto from "@/shared/components/CampoTexto";
import { useAuth } from "../hooks/useAuth";
import type { LoginData } from "../types/auth.types";

const valoresIniciales: LoginData = { email: "", password: "" };

function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await login(value.email, value.password);
        navigate("/categories");
      } catch (e) {
        setError(mensajeError(e, "No se pudo iniciar sesión"));
      }
    },
  });

  // no mostrar login si ya hay sesion 
  if (status === "authenticated") return <Navigate to="/categories" replace />;

  return (
    <main className="max-w-sm mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4 rounded-lg shadow p-6"
      >
        <form.Field
          name="email"
          validators={{ onChange: ({ value }) => (!value.trim() ? "El email es obligatorio" : undefined) }}
        >
          {(field) => <CampoTexto field={field} label="Email" tipo="email" />}
        </form.Field>

        <form.Field
          name="password"
          validators={{ onChange: ({ value }) => (!value ? "La contraseña es obligatoria" : undefined) }}
        >
          {(field) => <CampoTexto field={field} label="Contraseña" tipo="password" />}
        </form.Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700">
          Ingresar
        </button>

        <p className="text-sm">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Registrate
          </Link>
        </p>
      </form>
    </main>
  );
}

export default LoginPage;