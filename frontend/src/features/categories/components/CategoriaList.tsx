import type { Table } from "@tanstack/react-table";
import DataTable from "@/shared/components/DataTable";
import EmptyState from "@/shared/components/EmptyState";
import type { Categoria } from "../types/categoria.types";

interface CategoriaListProps {
  table: Table<Categoria>;
}

function CategoriaList({ table }: CategoriaListProps) {
  if (table.getCoreRowModel().rows.length === 0) {
    return <EmptyState mensaje="No hay categorías cargadas" />;
  }
  return <DataTable table={table} />;
}

export default CategoriaList;