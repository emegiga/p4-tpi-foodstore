import { flexRender } from "@tanstack/react-table";
import type { Table } from "@tanstack/react-table";

interface DataTableProps<T> {
  table: Table<T>;
}

// Tabla reutilizable: recibe la instancia creada con useReactTable en la página
function DataTable<T>({ table }: DataTableProps<T>) {
  return (
    <div>
      <table className="w-full overflow-hidden rounded-lg bg-white text-left shadow dark:bg-gray-800">
        <thead className="bg-gray-100 text-sm text-slate-700 dark:bg-gray-700 dark:text-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className={`px-4 py-2 ${header.column.getCanSort() ? "cursor-pointer select-none" : ""}`}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" && " ▲"}
                  {header.column.getIsSorted() === "desc" && " ▼"}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-200 dark:border-gray-700">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 flex items-center justify-end gap-3 text-sm">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded bg-gray-200 px-3 py-1 hover:bg-slate-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded bg-gray-200 px-3 py-1 hover:bg-slate-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default DataTable;