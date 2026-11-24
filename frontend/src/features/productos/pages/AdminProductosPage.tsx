import { useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCategorias } from "@/features/categorias/hooks/useCategorias";
import { handleApiError } from "@/shared/api/handleApiError";
import DataTable from "@/shared/components/DataTable";
import EstadoError from "@/shared/components/EstadoError";
import EstadoVacio from "@/shared/components/EstadoVacio";
import Button from "@/shared/ui/Button";
import ProductoModal from "../components/ProductoModal";
import StockModal from "../components/StockModal";
import { useProductoMutations, useProductos } from "../hooks/useProductos";
import type { Producto, ProductoInput, StockInput } from "../types/producto.types";

const columnHelper = createColumnHelper<Producto>();
const sinProductos: Producto[] = [];
// el panel pide hasta 100 y pagina del lado del cliente
const FILTROS_PANEL = { skip: 0, limit: 100 };

function AdminProductosPage() {
  const { data, isLoading, isError, error } = useProductos(FILTROS_PANEL);
  const { data: categorias = [] } = useCategorias();
  const { crear, editar, actualizarStock, eliminar } = useProductoMutations();

  // undefined = cerrado, null = alta, Producto = edición
  const [enEdicion, setEnEdicion] = useState<Producto | null | undefined>(undefined);
  const [enStock, setEnStock] = useState<Producto | null>(null);

  const guardarProducto = (data: ProductoInput) => {
    const cerrar = { onSuccess: () => setEnEdicion(undefined) };
    if (enEdicion) editar.mutate({ id: enEdicion.id, data }, cerrar);
    else crear.mutate(data, cerrar);
  };

  const guardarStock = (data: StockInput) => {
    if (enStock) actualizarStock.mutate({ id: enStock.id, data }, { onSuccess: () => setEnStock(null) });
  };

  const handleEliminar = (producto: Producto) => {
    if (window.confirm(`¿Dar de baja el producto "${producto.nombre}"?`)) {
      eliminar.mutate(producto.id);
    }
  };

  const columns = [
    columnHelper.accessor("nombre", { header: "Nombre" }),
    columnHelper.accessor((p) => p.categoria.nombre, { id: "categoria", header: "Categoría" }),
    columnHelper.accessor("precio_base", {
      header: "Precio",
      cell: (info) => `$ ${info.getValue().toLocaleString("es-AR")}`,
    }),
    columnHelper.accessor("stock", { header: "Stock" }),
    columnHelper.accessor("disponible", {
      header: "Disponible",
      cell: (info) => (info.getValue() ? "Sí" : "No"),
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variante="secundario" className="py-1" onClick={() => setEnEdicion(row.original)}>
            Editar
          </Button>
          <Button variante="secundario" className="py-1" onClick={() => setEnStock(row.original)}>
            Stock
          </Button>
          <Button variante="peligro" className="py-1" onClick={() => handleEliminar(row.original)}>
            Eliminar
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: data?.items ?? sinProductos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const mutacionProducto = enEdicion ? editar : crear;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button onClick={() => setEnEdicion(null)} disabled={categorias.length === 0}>
          Nuevo producto
        </Button>
      </div>

      {eliminar.isError && <EstadoError mensaje={handleApiError(eliminar.error, "No se pudo eliminar")} />}
      {isLoading && <p className="text-gray-500">Cargando productos...</p>}
      {isError && <EstadoError mensaje={handleApiError(error, "Error al cargar los productos")} />}
      {data && data.items.length === 0 && <EstadoVacio mensaje="No hay productos cargados" />}
      {data && data.items.length > 0 && <DataTable table={table} />}

      {enEdicion !== undefined && (
        <ProductoModal
          producto={enEdicion}
          categorias={categorias}
          error={mutacionProducto.isError ? handleApiError(mutacionProducto.error, "No se pudo guardar") : null}
          onGuardar={guardarProducto}
          onCerrar={() => setEnEdicion(undefined)}
        />
      )}

      {enStock && (
        <StockModal
          producto={enStock}
          error={actualizarStock.isError ? handleApiError(actualizarStock.error, "No se pudo actualizar") : null}
          onGuardar={guardarStock}
          onCerrar={() => setEnStock(null)}
        />
      )}
    </div>
  );
}

export default AdminProductosPage;