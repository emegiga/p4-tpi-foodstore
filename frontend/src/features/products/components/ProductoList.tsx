import type { Table } from "@tanstack/react-table";
import DataTable from "@/shared/components/DataTable";
import EmptyState from "@/shared/components/EmptyState";
import type { Producto } from "../types/producto.types";

interface ProductoListProps {
  table: Table<Producto>;
}

function ProductoList({ table }: ProductoListProps) {
  if (table.getCoreRowModel().rows.length === 0) {
    return <EmptyState mensaje="No hay productos cargados" />;
  }
  return <DataTable table={table} />;
}

export default ProductoList;