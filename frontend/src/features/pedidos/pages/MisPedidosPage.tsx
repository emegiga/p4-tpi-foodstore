import { useState } from "react";
import { handleApiError } from "@/shared/api/handleApiError";
import EstadoError from "@/shared/components/EstadoError";
import EstadoVacio from "@/shared/components/EstadoVacio";
import Paginacion from "@/shared/components/Paginacion";
import BadgeEstado from "@/shared/ui/BadgeEstado";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import PedidoDetalle from "../components/PedidoDetalle";
import { useCancelarPedido } from "../hooks/useCancelarPedido";
import { usePedidos } from "../hooks/usePedidos";
import type { Pedido } from "../types/pedido.types";

const POR_PAGINA = 5;

function MisPedidosPage() {
  const [pagina, setPagina] = useState(0);
  const [abierto, setAbierto] = useState<number | null>(null); // id del pedido con el detalle visible
  // el backend devuelve solo los pedidos del usuario de la sesión
  const { data, isLoading, isError, error } = usePedidos({ skip: pagina * POR_PAGINA, limit: POR_PAGINA });
  const cancelar = useCancelarPedido();

  const handleCancelar = (pedido: Pedido) => {
    if (window.confirm(`¿Cancelar el pedido #${pedido.id}?`)) {
      cancelar.mutate(pedido.id);
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Mis pedidos</h1>

      {cancelar.isError && <EstadoError mensaje={handleApiError(cancelar.error, "No se pudo cancelar")} />}
      {isLoading && <p className="text-gray-500">Cargando pedidos...</p>}
      {isError && <EstadoError mensaje={handleApiError(error, "Error al cargar tus pedidos")} />}
      {data && data.items.length === 0 && <EstadoVacio mensaje="Todavía no hiciste pedidos" />}

      {data && data.items.length > 0 && (
        <div className="flex flex-col gap-3">
          {data.items.map((pedido) => (
            <Card key={pedido.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">Pedido #{pedido.id}</p>
                  <p className="text-sm text-gray-500">{new Date(pedido.created_at).toLocaleString("es-AR")}</p>
                </div>
                <BadgeEstado estado={pedido.estado} />
                <span className="text-lg font-bold">$ {pedido.total.toLocaleString("es-AR")}</span>
                <div className="flex gap-2">
                  <Button
                    variante="secundario"
                    className="py-1"
                    onClick={() => setAbierto(abierto === pedido.id ? null : pedido.id)}
                  >
                    {abierto === pedido.id ? "Ocultar" : "Ver detalle"}
                  </Button>
                  {/* el cliente solo puede cancelar en PENDIENTE */}
                  {pedido.estado === "PENDIENTE" && (
                    <Button variante="peligro" className="py-1" onClick={() => handleCancelar(pedido)}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
              {abierto === pedido.id && <PedidoDetalle pedido={pedido} />}
            </Card>
          ))}
          <Paginacion
            pagina={pagina}
            totalPaginas={Math.ceil(data.total / POR_PAGINA)}
            onCambiar={setPagina}
          />
        </div>
      )}
    </div>
  );
}

export default MisPedidosPage;