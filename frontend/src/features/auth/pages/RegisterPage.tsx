import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "react-router-dom";
import { handleApiError } from "@/shared/api/handleApiError";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import { useRegistro } from "../hooks/useRegistro";
import type { RegisterData } from "../types/auth.types";

const valoresIniciales: RegisterData = { username: "", full_name: "", email: "", password: "" };

const obligatorio = ({ value }: { value: string }) =>
  !value.trim() ? "Este campo es obligatorio" : undefined;

function RegisterPage() {
  const navigate = useNavigate();
  const registro = useRegistro();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await registro.mutateAsync(value);
        navigate("/login");
      } catch (e) {
        setError(handleApiError(e, "No se pudo completar el registro"));
      }
    },
  });

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-bold">Crear cuenta</h1>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow"
      >
        <form.Field
          name="username"
          validators={{ onChange: ({ value }) => (value.trim().length < 3 ? "Mínimo 3 caracteres" : undefined) }}
        >
          {(field) => <Input field={field} label="Usuario" />}
        </form.Field>

        <form.Field name="full_name" validators={{ onChange: obligatorio }}>
          {(field) => <Input field={field} label="Nombre completo" />}
        </form.Field>

        <form.Field
          name="email"
          validators={{ onChange: ({ value }) => (!value.includes("@") ? "Email inválido" : undefined) }}
        >
          {(field) => <Input field={field} label="Email" tipo="email" />}
        </form.Field>

        <form.Field
          name="password"
          validators={{ onChange: ({ value }) => (value.length < 8 ? "Mínimo 8 caracteres" : undefined) }}
        >
          {(field) => <Input field={field} label="Contraseña" tipo="password" />}
        </form.Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={registro.isPending}>
          Registrarme
        </Button>

        <p className="text-sm">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;