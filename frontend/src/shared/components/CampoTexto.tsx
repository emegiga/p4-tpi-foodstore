import type { AnyFieldApi } from "@tanstack/react-form";

interface CampoTextoProps {
  field: AnyFieldApi;
  label: string;
  multilinea?: boolean;
  tipo?: "text" | "email" | "password";
}

function CampoTexto({ field, label, multilinea = false, tipo = "text" }: CampoTextoProps) {
  const clases = "border border-slate-300 rounded px-3 py-2";

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

export default CampoTexto;