import type { Table } from "@tanstack/react-table";
import DataTable from "@/shared/components/DataTable";
import EmptyState from "@/shared/components/EmptyState";
import type { Ingrediente } from "../types/ingrediente.types";

interface IngredienteListProps {
  table: Table<Ingrediente>;
}

function IngredienteList({ table }: IngredienteListProps) {
  if (table.getCoreRowModel().rows.length === 0) {
    return <EmptyState mensaje="No hay ingredientes cargados" />;
  }
  return <DataTable table={table} />;
}

export default IngredienteList;
