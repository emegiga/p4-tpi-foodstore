import { useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { handleApiError } from "@/shared/api/handleApiError";
import DataTable from "@/shared/components/DataTable";
import EstadoError from "@/shared/components/EstadoError";
import EstadoVacio from "@/shared/components/EstadoVacio";
import BadgeEstado from "@/shared/ui/BadgeEstado";
import Button from "@/shared/ui/Button";
import { useCambiarEstadoPedido } from "../hooks/useCambiarEstadoPedido";
import { usePedidos } from "../hooks/usePedidos";
import type { EstadoPedido, Pedido } from "../types/pedido.types";

const columnHelper = createColumnHelper<Pedido>();
const sinPedidos: Pedido[] = [];
const ESTADOS: EstadoPedido[] = ["PENDIENTE", "EN_PREPARACION", "ENTREGADO", "CANCELADO"];

// siguiente estado según la máquina de estados (los terminales no avanzan)
const SIGUIENTE: Partial<Record<EstadoPedido, { estado: EstadoPedido; texto: string }>> = {
  PENDIENTE: { estado: "EN_PREPARACION", texto: "Preparar" },
  EN_PREPARACION: { estado: "ENTREGADO", texto: "Entregar" },
};

function AdminPedidosPage() {
  const [estado, setEstado] = useState<EstadoPedido | "">("");
  const { data, isLoading, isError, error } = usePedidos({
    skip: 0,
    limit: 100,
    estado: estado || undefined,
  });
  const cambiarEstado = useCambiarEstadoPedido();

  const cancelar = (pedido: Pedido) => {
    if (window.confirm(`¿Cancelar el pedido #${pedido.id}? Se devuelve el stock.`)) {
      cambiarEstado.mutate({ id: pedido.id, estado: "CANCELADO" });
    }
  };

  const columns = [
    columnHelper.accessor("id", { header: "#" }),
    columnHelper.accessor("created_at", {
      header: "Fecha",
      cell: (info) => new Date(info.getValue()).toLocaleString("es-AR"),
    }),
    columnHelper.accessor("usuario_id", { header: "Cliente", cell: (info) => `#${info.getValue()}` }),
    columnHelper.accessor("total", { header: "Total", cell: (info) => `$ ${info.getValue().toLocaleString("es-AR")}` }),
    columnHelper.accessor("forma_pago", { header: "Pago" }),
    columnHelper.accessor("estado", { header: "Estado", cell: (info) => <BadgeEstado estado={info.getValue()} /> }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const pedido = row.original;
        const siguiente = SIGUIENTE[pedido.estado];
        if (!siguiente) return null; // ENTREGADO y CANCELADO son terminales
        return (
          <div className="flex gap-2">
            <Button
              className="py-1"
              onClick={() => cambiarEstado.mutate({ id: pedido.id, estado: siguiente.estado })}
            >
              {siguiente.texto}
            </Button>
            <Button variante="peligro" className="py-1" onClick={() => cancelar(pedido)}>
              Cancelar
            </Button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: data?.items ?? sinPedidos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as EstadoPedido | "")}
          className="rounded border border-gray-300 px-3 py-2"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {cambiarEstado.isError && (
        <EstadoError mensaje={handleApiError(cambiarEstado.error, "No se pudo cambiar el estado")} />
      )}
      {isLoading && <p className="text-gray-500">Cargando pedidos...</p>}
      {isError && <EstadoError mensaje={handleApiError(error, "Error al cargar los pedidos")} />}
      {data && data.items.length === 0 && <EstadoVacio mensaje="No hay pedidos" />}
      {data && data.items.length > 0 && <DataTable table={table} />}
    </div>
  );
}

export default AdminPedidosPage;