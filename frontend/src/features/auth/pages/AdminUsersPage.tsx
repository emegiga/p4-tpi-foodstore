import { mensajeError } from "@/shared/api/errores";
import EmptyState from "@/shared/components/EmptyState";
import ErrorMessage from "@/shared/components/ErrorMessage";
import Loading from "@/shared/components/Loading";
import { useUsers } from "../hooks/useUsers";

function AdminUsersPage() {
  const { usuarios, isLoading, isError, error, activar, desactivar } = useUsers();

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Usuarios</h1>

      {isLoading && <Loading mensaje="Cargando usuarios..." />}

      {isError && <ErrorMessage mensaje={mensajeError(error, "Error al cargar usuarios")} />}

      {!isLoading && !isError && usuarios.length === 0 && <EmptyState mensaje="No hay usuarios" />}

      {!isLoading && !isError && usuarios.length > 0 && (
        <table className="w-full overflow-hidden rounded-lg bg-white text-left shadow dark:bg-gray-800">
          <thead className="bg-gray-100 text-sm text-slate-700 dark:bg-gray-700 dark:text-gray-100">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Roles</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-t border-slate-200 dark:border-gray-700">
                <td className="px-4 py-2">
                  {usuario.nombre} {usuario.apellido}
                </td>
                <td className="px-4 py-2">{usuario.email}</td>
                <td className="px-4 py-2">{usuario.roles.join(", ")}</td>
                <td className="px-4 py-2">{usuario.activo ? "Activo" : "Desactivado"}</td>
                <td className="px-4 py-2">
                  {usuario.activo ? (
                    <button
                      onClick={() => desactivar.mutate(usuario.id)}
                      className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-700"
                    >
                      Desactivar
                    </button>
                  ) : (
                    <button
                      onClick={() => activar.mutate(usuario.id)}
                      className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-700"
                    >
                      Activar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default AdminUsersPage;