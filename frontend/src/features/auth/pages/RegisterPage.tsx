import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "react-router-dom";
import { mensajeError } from "@/shared/api/errores";
import CampoTexto from "@/shared/components/CampoTexto";
import { useAuth } from "../hooks/useAuth";
import type { RegisterData } from "../types/auth.types";

const valoresIniciales: RegisterData = {
  nombre: "",
  apellido: "",
  email: "",
  celular: "",
  password: "",
};

const obligatorio = ({ value }: { value: string }) =>
  !value.trim() ? "Este campo es obligatorio" : undefined;

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await register.mutateAsync(value);
        navigate("/login");
      } catch (e) {
        setError(mensajeError(e, "No se pudo completar el registro"));
      }
    },
  });

  return (
    <main className="max-w-sm mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Crear cuenta</h1>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4 rounded-lg shadow p-6"
      >
        <form.Field name="nombre" validators={{ onChange: obligatorio }}>
          {(field) => <CampoTexto field={field} label="Nombre" />}
        </form.Field>

        <form.Field name="apellido" validators={{ onChange: obligatorio }}>
          {(field) => <CampoTexto field={field} label="Apellido" />}
        </form.Field>

        <form.Field name="email" validators={{ onChange: obligatorio }}>
          {(field) => <CampoTexto field={field} label="Email" tipo="email" />}
        </form.Field>

        <form.Field name="celular">
          {(field) => <CampoTexto field={field} label="Celular (opcional)" />}
        </form.Field>

        <form.Field name="password" validators={{ onChange: obligatorio }}>
          {(field) => <CampoTexto field={field} label="Contraseña" tipo="password" />}
        </form.Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700">
          Registrarme
        </button>

        <p className="text-sm">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </form>
    </main>
  );
}

export default RegisterPage;