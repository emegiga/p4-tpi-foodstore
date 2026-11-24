import { useState } from "react";
import { useForm } from "@tanstack/react-form";
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
import EstadoVacio from "@/shared/components/EstadoVacio";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Modal from "@/shared/ui/Modal";
import { useCategoriaMutations, useCategorias } from "../hooks/useCategorias";
import type { Categoria, CategoriaInput } from "../types/categoria.types";

const columnHelper = createColumnHelper<Categoria>();
const sinCategorias: Categoria[] = [];
const valoresVacios: CategoriaInput = { nombre: "", descripcion: "" };

function AdminCategoriasPage() {
  const { data, isLoading, isError, error } = useCategorias();
  const { crear, editar, eliminar } = useCategoriaMutations();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [seleccionada, setSeleccionada] = useState<Categoria | null>(null);

  const form = useForm({
    defaultValues: valoresVacios,
    onSubmit: ({ value }) => {
      if (seleccionada) {
        editar.mutate({ id: seleccionada.id, data: value }, { onSuccess: cerrarModal });
      } else {
        crear.mutate(value, { onSuccess: cerrarModal });
      }
    },
  });

  const abrirAlta = () => {
    setSeleccionada(null);
    form.reset(valoresVacios, { keepDefaultValues: true });
    setModalAbierto(true);
  };

  const abrirEdicion = (categoria: Categoria) => {
    setSeleccionada(categoria);
    form.reset({ nombre: categoria.nombre, descripcion: categoria.descripcion }, { keepDefaultValues: true });
    setModalAbierto(true);
  };

  function cerrarModal() {
    setModalAbierto(false);
    setSeleccionada(null);
  }

  const handleEliminar = (categoria: Categoria) => {
    if (window.confirm(`¿Dar de baja la categoría "${categoria.nombre}"?`)) {
      eliminar.mutate(categoria.id);
    }
  };

  const columns = [
    columnHelper.accessor("nombre", { header: "Nombre" }),
    columnHelper.accessor("descripcion", { header: "Descripción" }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variante="secundario" className="py-1" onClick={() => abrirEdicion(row.original)}>
            Editar
          </Button>
          <Button variante="peligro" className="py-1" onClick={() => handleEliminar(row.original)}>
            Eliminar
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: data ?? sinCategorias,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const mutacionActual = seleccionada ? editar : crear;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Button onClick={abrirAlta}>Nueva categoría</Button>
      </div>

      {eliminar.isError && <EstadoError mensaje={handleApiError(eliminar.error, "No se pudo eliminar")} />}
      {isLoading && <p className="text-gray-500">Cargando categorías...</p>}
      {isError && <EstadoError mensaje={handleApiError(error, "Error al cargar las categorías")} />}
      {data && data.length === 0 && <EstadoVacio mensaje="No hay categorías cargadas" />}
      {data && data.length > 0 && <DataTable table={table} />}

      <Modal
        isOpen={modalAbierto}
        titulo={seleccionada ? "Editar categoría" : "Nueva categoría"}
        onClose={cerrarModal}
        onSubmit={() => form.handleSubmit()}
        errorMessage={mutacionActual.isError ? handleApiError(mutacionActual.error, "No se pudo guardar") : null}
      >
        <form.Field
          name="nombre"
          validators={{ onChange: ({ value }) => (value.trim().length < 2 ? "Mínimo 2 caracteres" : undefined) }}
        >
          {(field) => <Input field={field} label="Nombre" />}
        </form.Field>

        <form.Field name="descripcion">
          {(field) => <Input field={field} label="Descripción" multilinea />}
        </form.Field>
      </Modal>
    </div>
  );
}

export default AdminCategoriasPage;