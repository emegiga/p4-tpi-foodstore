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
import Modal from "@/shared/components/Modal";
import IngredienteList from "../components/IngredienteList";
import { useIngredients } from "../hooks/useIngredients";
import type { Ingrediente, IngredienteInput } from "../types/ingrediente.types";

const columnHelper = createColumnHelper<Ingrediente>();
const valoresVacios: IngredienteInput = { nombre: "" };

function IngredientsPage() {
  const esAdmin = useAuthStore((state) => state.hasRole("admin"));

  // Estado de interfaz (useState)
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState<Ingrediente | null>(null);

  // Estado del servidor (custom hook con TanStack Query)
  const { ingredientes, isLoading, isError, error, crear, editar, eliminar } = useIngredients();

  // Formulario (TanStack Form)
  const form = useForm({
    defaultValues: valoresVacios,
    onSubmit: ({ value }) => {
      if (ingredienteSeleccionado) {
        editar.mutate({ id: ingredienteSeleccionado.id, data: value }, { onSuccess: cerrarModal });
      } else {
        crear.mutate(value, { onSuccess: cerrarModal });
      }
    },
  });

  const abrirAlta = () => {
    setIngredienteSeleccionado(null);
    form.reset(valoresVacios, { keepDefaultValues: true });
    setModalAbierto(true);
  };

  const abrirEdicion = (ingrediente: Ingrediente) => {
    setIngredienteSeleccionado(ingrediente);
    form.reset({ nombre: ingrediente.nombre }, { keepDefaultValues: true });
    setModalAbierto(true);
  };

  function cerrarModal() {
    setModalAbierto(false);
    setIngredienteSeleccionado(null);
  }

  const handleEliminar = (ingrediente: Ingrediente) => {
    if (window.confirm(`¿Eliminar el ingrediente "${ingrediente.nombre}"?`)) {
      eliminar.mutate(ingrediente.id);
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
    // los botones de editar y eliminar solo se muestran al admin
    ...(esAdmin ? [columnaAcciones] : []),
  ];

  const table = useReactTable({
    data: ingredientes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const mutacionActual = ingredienteSeleccionado ? editar : crear;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ingredientes</h1>
        {esAdmin && (
          <button
            onClick={abrirAlta}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Nuevo ingrediente
          </button>
        )}
      </div>

      {isLoading && <Loading mensaje="Cargando ingredientes..." />}

      {isError && <ErrorMessage mensaje={mensajeError(error, "Error al cargar ingredientes")} />}

      {!isLoading && !isError && <IngredienteList table={table} />}

      <Modal
        isOpen={modalAbierto}
        titulo={ingredienteSeleccionado ? "Editar ingrediente" : "Nuevo ingrediente"}
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
      </Modal>
    </main>
  );
}

export default IngredientsPage;
