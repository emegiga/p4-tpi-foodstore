import { handleApiError } from "@/shared/api/handleApiError";
import EstadoError from "@/shared/components/EstadoError";
import TarjetaResumen from "../components/TarjetaResumen";
import { useResumenPedidos } from "../hooks/useResumenPedidos";

function AdminResumenPage() {
  const { data, isLoading, isError, error } = useResumenPedidos();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Resumen</h1>

      {isLoading && <p className="text-gray-500">Cargando resumen...</p>}
      {isError && <EstadoError mensaje={handleApiError(error, "Error al cargar el resumen")} />}

      {data && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <TarjetaResumen titulo="Pendientes" valor={data.pendientes} />
          <TarjetaResumen titulo="En preparación" valor={data.en_preparacion} />
          <TarjetaResumen titulo="Entregados" valor={data.entregados} />
          <TarjetaResumen titulo="Cancelados" valor={data.cancelados} />
          <TarjetaResumen titulo="Pedidos de hoy" valor={data.pedidos_hoy} />
          <TarjetaResumen
            titulo="Ingresos (entregados)"
            valor={`$ ${data.ingresos_entregados.toLocaleString("es-AR")}`}
          />
        </div>
      )}
    </div>
  );
}

export default AdminResumenPage;
