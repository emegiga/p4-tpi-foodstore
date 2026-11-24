import type { AnyFieldApi } from "@tanstack/react-form";

interface InputProps {
  field: AnyFieldApi; // campo de TanStack Form
  label: string;
  tipo?: "text" | "email" | "password";
  multilinea?: boolean;
}

function Input({ field, label, tipo = "text", multilinea = false }: InputProps) {
  const clases = "rounded border border-gray-300 px-3 py-2";

  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      {multilinea ? (
        <textarea
          rows={3}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          className={clases}
        />
      ) : (
        <input
          type={tipo}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          className={clases}
        />
      )}
      {field.state.meta.errors.length > 0 && (
        <span className="text-sm text-red-600">{field.state.meta.errors.join(", ")}</span>
      )}
    </label>
  );
}

export default Input;