import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { handleApiError } from "@/shared/api/handleApiError";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import { useAuthStore } from "@/store/authStore";

function LoginPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { username: "", password: "" },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await login(value.username, value.password);
        navigate("/");
      } catch (e) {
        setError(handleApiError(e, "No se pudo iniciar sesión"));
      }
    },
  });

  // si ya hay sesión no se muestra login
  if (usuario) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-bold">Iniciar sesión</h1>

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
          validators={{ onChange: ({ value }) => (!value.trim() ? "El usuario es obligatorio" : undefined) }}
        >
          {(field) => <Input field={field} label="Usuario" />}
        </form.Field>

        <form.Field
          name="password"
          validators={{ onChange: ({ value }) => (!value ? "La contraseña es obligatoria" : undefined) }}
        >
          {(field) => <Input field={field} label="Contraseña" tipo="password" />}
        </form.Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit">Ingresar</Button>

        <p className="text-sm">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Registrate
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;