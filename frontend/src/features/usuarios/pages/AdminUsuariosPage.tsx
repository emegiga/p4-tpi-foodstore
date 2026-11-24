import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { handleApiError } from "@/shared/api/handleApiError";
import DataTable from "@/shared/components/DataTable";
import EstadoError from "@/shared/components/EstadoError";
import Button from "@/shared/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useCambiarEstadoUsuario, useUsuarios } from "../hooks/useUsuarios";
import type { Usuario } from "../types/usuario.types";

const columnHelper = createColumnHelper<Usuario>();
const sinUsuarios: Usuario[] = [];

function AdminUsuariosPage() {
  const usuarioActual = useAuthStore((s) => s.usuario);
  const { data, isLoading, isError, error } = useUsuarios();
  const cambiarEstado = useCambiarEstadoUsuario();

  const columns = [
    columnHelper.accessor("username", { header: "Usuario" }),
    columnHelper.accessor("full_name", { header: "Nombre" }),
    columnHelper.accessor("email", { header: "Email" }),
    columnHelper.accessor("role", { header: "Rol" }),
    columnHelper.accessor("disabled", {
      header: "Estado",
      cell: (info) => (info.getValue() ? "Desactivado" : "Activo"),
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const usuario = row.original;
        if (usuario.disabled) {
          return (
            <Button className="py-1" onClick={() => cambiarEstado.mutate({ id: usuario.id, activar: true })}>
              Activar
            </Button>
          );
        }
        // el admin no puede desactivarse a sí mismo: el botón no se muestra en su fila
        if (usuario.id === usuarioActual?.id) return null;
        return (
          <Button
            variante="peligro"
            className="py-1"
            onClick={() => cambiarEstado.mutate({ id: usuario.id, activar: false })}
          >
            Desactivar
          </Button>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: data ?? sinUsuarios,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Usuarios</h1>

      {cambiarEstado.isError && (
        <EstadoError mensaje={handleApiError(cambiarEstado.error, "No se pudo cambiar el estado")} />
      )}
      {isLoading && <p className="text-gray-500">Cargando usuarios...</p>}
      {isError && <EstadoError mensaje={handleApiError(error, "Error al cargar los usuarios")} />}
      {data && <DataTable table={table} />}
    </div>
  );
}

export default AdminUsuariosPage;
