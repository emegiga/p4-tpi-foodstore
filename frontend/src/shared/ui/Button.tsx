import type { ButtonHTMLAttributes } from "react";

type Variante = "primario" | "secundario" | "peligro";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

const estilos: Record<Variante, string> = {
  primario: "bg-green-600 text-white hover:bg-green-700",
  secundario: "bg-gray-200 hover:bg-gray-300",
  peligro: "bg-red-500 text-white hover:bg-red-600",
};

function Button({ variante = "primario", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded px-4 py-2 disabled:opacity-50 ${estilos[variante]} ${className}`}
      {...props}
    />
  );
}

export default Button;