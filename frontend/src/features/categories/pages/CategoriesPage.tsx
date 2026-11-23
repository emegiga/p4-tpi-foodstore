import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAuthStore } from "@/features/auth";
import { mensajeError } from "@/shared/api/errores";
import CampoTexto from "@/shared/components/CampoTexto";
import ErrorMessage from "@/shared/components/ErrorMessage";
import Loading from "@/shared/components/Loading";
import CategoriaList from "../components/CategoriaList";
import CategoriaModal from "../components/CategoriaModal";
import { useCategories } from "../hooks/useCategories";
import type { Categoria, CategoriaInput } from "../types/categoria.types";

const columnHelper = createColumnHelper<Categoria>();
const valoresVacios: CategoriaInput = { nombre: "", descripcion: "" };

function CategoriesPage() {
  const esAdmin = useAuthStore((state) => state.hasRole("admin"));

  // Estado de interfaz (useState)
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);

  // Estado del servidor (custom hook con TanStack Query)
  const { categorias, isLoading, isError, error, crear, editar, eliminar } = useCategories();

  // Formulario (TanStack Form)
  const form = useForm({
    defaultValues: valoresVacios,
    onSubmit: ({ value }) => {
      if (categoriaSeleccionada) {
        editar.mutate({ id: categoriaSeleccionada.id, data: value }, { onSuccess: cerrarModal });
      } else {
        crear.mutate(value, { onSuccess: cerrarModal });
      }
    },
  });

  const abrirAlta = () => {
    setCategoriaSeleccionada(null);
    form.reset(valoresVacios, { keepDefaultValues: true });
    setModalAbierto(true);
  };

  const abrirEdicion = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    form.reset(
      { nombre: categoria.nombre, descripcion: categoria.descripcion },
      { keepDefaultValues: true }
    );
    setModalAbierto(true);
  };

  function cerrarModal() {
    setModalAbierto(false);
    setCategoriaSeleccionada(null);
  }

  const handleEliminar = (categoria: Categoria) => {
    if (window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) {
      eliminar.mutate(categoria.id);
    }
  };

  // Tabla (TanStack Table)
  const columnaAcciones = columnHelper.display({
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          onClick={() => abrirEdicion(row.original)}
          className="px-3 py-1 rounded bg-blue-400 text-white hover:bg-blue-600"
        >
          Editar
        </button>
        <button
          onClick={() => handleEliminar(row.original)}
          className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    ),
  });

  const columns = [
    columnHelper.accessor("nombre", { header: "Nombre" }),
    columnHelper.accessor("descripcion", { header: "Descripción" }),
    // los botones de editar y eliminar solo se muestran al admin
    ...(esAdmin ? [columnaAcciones] : []),
  ];

  const table = useReactTable({
    data: categorias,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const mutacionActual = categoriaSeleccionada ? editar : crear;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categorías</h1>
        {esAdmin && (
          <button
            onClick={abrirAlta}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Nueva categoría
          </button>
        )}
      </div>

      {isLoading && <Loading mensaje="Cargando categorías..." />}

      {isError && <ErrorMessage mensaje={mensajeError(error, "Error al cargar categorías")} />}

      {!isLoading && !isError && <CategoriaList table={table} />}

      <CategoriaModal
        isOpen={modalAbierto}
        esEdicion={categoriaSeleccionada !== null}
        onClose={cerrarModal}
        onSubmit={() => form.handleSubmit()}
        errorMessage={mutacionActual.isError ? mensajeError(mutacionActual.error, "No se pudo guardar") : null}
      >
        <form.Field
          name="nombre"
          validators={{
            onChange: ({ value }) => (!value.trim() ? "El nombre es obligatorio" : undefined),
          }}
        >
          {(field) => <CampoTexto field={field} label="Nombre" />}
        </form.Field>

        <form.Field name="descripcion">
          {(field) => <CampoTexto field={field} label="Descripción" multilinea />}
        </form.Field>
      </CategoriaModal>
    </main>
  );
}

export default CategoriesPage;