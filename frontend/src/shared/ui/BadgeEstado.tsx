const colores: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  EN_PREPARACION: "bg-blue-100 text-blue-800",
  ENTREGADO: "bg-green-100 text-green-800",
  CANCELADO: "bg-red-100 text-red-800",
};

interface BadgeEstadoProps {
  estado: string;
}

// pinta los 4 estados del pedido
function BadgeEstado({ estado }: BadgeEstadoProps) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colores[estado] ?? "bg-gray-100"}`}>
      {estado.replace("_", " ")}
    </span>
  );
}

export default BadgeEstado;