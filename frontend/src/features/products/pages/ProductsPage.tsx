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
import ProductoList from "../components/ProductoList";
import { useProducts } from "../hooks/useProducts";
import type { Producto, ProductoInput } from "../types/producto.types";

const columnHelper = createColumnHelper<Producto>();
const valoresVacios: ProductoInput = {
  nombre: "",
  descripcion: "",
  precio_base: 0,
  imagenes_url: [],
  disponible: true,
};

function ProductsPage() {
  const esAdmin = useAuthStore((state) => state.hasRole("admin"));

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  // estado del servidor (custom hook con TanStack Query)
  const { productos, isLoading, isError, error, crear, editar, eliminar } = useProducts();

  const form = useForm({
    defaultValues: valoresVacios,
    onSubmit: ({ value }) => {
      if (productoSeleccionado) {
        editar.mutate({ id: productoSeleccionado.id, data: value }, { onSuccess: cerrarModal });
      } else {
        crear.mutate(value, { onSuccess: cerrarModal });
      }
    },
  });

  const abrirAlta = () => {
    setProductoSeleccionado(null);
    form.reset(valoresVacios, { keepDefaultValues: true });
    setModalAbierto(true);
  };

  const abrirEdicion = (producto: Producto) => {
    setProductoSeleccionado(producto);
    form.reset(
      {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio_base: producto.precio_base,
        imagenes_url: producto.imagenes_url,
        disponible: producto.disponible,
      },
      { keepDefaultValues: true }
    );
    setModalAbierto(true);
  };

  function cerrarModal() {
    setModalAbierto(false);
    setProductoSeleccionado(null);
  }

  const handleEliminar = (producto: Producto) => {
    if (window.confirm(`¿Eliminar el producto "${producto.nombre}"?`)) {
      eliminar.mutate(producto.id);
    }
  };

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
    columnHelper.accessor("precio_base", {
      header: "Precio",
      cell: (info) => `$ ${info.getValue()}`,
    }),
    columnHelper.accessor("categorias", {
      header: "Categorías",
      enableSorting: false,
      cell: (info) => info.getValue().map((c) => c.nombre).join(", ") || "-",
    }),
    columnHelper.accessor("disponible", {
      header: "Disponible",
      cell: (info) => (info.getValue() ? "Sí" : "No"),
    }),
    // botones de editar y eliminar solo se muestran al admin
    ...(esAdmin ? [columnaAcciones] : []),
  ];

  const table = useReactTable({
    data: productos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const mutacionActual = productoSeleccionado ? editar : crear;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        {esAdmin && (
          <button
            onClick={abrirAlta}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Nuevo producto
          </button>
        )}
      </div>

      {isLoading && <Loading mensaje="Cargando productos..." />}

      {isError && <ErrorMessage mensaje={mensajeError(error, "Error al cargar productos")} />}

      {!isLoading && !isError && <ProductoList table={table} />}

      <Modal
        isOpen={modalAbierto}
        titulo={productoSeleccionado ? "Editar producto" : "Nuevo producto"}
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

        <form.Field
          name="precio_base"
          validators={{
            onChange: ({ value }) => {
              if (Number.isNaN(value)) return "El precio es obligatorio";
              if (value < 0) return "El precio no puede ser negativo";
              return undefined;
            },
          }}
        >
          {(field) => (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Precio base</span>
              <input
                type="number"
                step="0.01"
                value={Number.isNaN(field.state.value) ? "" : field.state.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                className="border border-slate-300 rounded px-3 py-2"
              />
              {field.state.meta.errors.length > 0 && (
                <span className="text-sm text-red-600">{field.state.meta.errors.join(", ")}</span>
              )}
            </label>
          )}
        </form.Field>

        <form.Field name="disponible">
          {(field) => (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
              />
              <span className="text-sm font-medium">Disponible</span>
            </label>
          )}
        </form.Field>
      </Modal>
    </main>
  );
}

export default ProductsPage;