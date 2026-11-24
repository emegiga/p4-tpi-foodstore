import { useForm } from "@tanstack/react-form";
import type { Categoria } from "@/features/categorias/types/categoria.types";
import Input from "@/shared/ui/Input";
import Modal from "@/shared/ui/Modal";
import type { Producto, ProductoInput } from "../types/producto.types";

interface ProductoModalProps {
  producto: Producto | null; // null = alta
  categorias: Categoria[];
  error: string | null;
  onGuardar: (data: ProductoInput) => void;
  onCerrar: () => void;
}

const claseCampo = "rounded border border-gray-300 px-3 py-2";

// Formulario de alta y edición de productos (se monta de nuevo cada vez que se abre)
function ProductoModal({ producto, categorias, error, onGuardar, onCerrar }: ProductoModalProps) {
  const form = useForm({
    defaultValues: {
      categoria_id: producto?.categoria_id ?? categorias[0]?.id ?? 0,
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      precio_base: producto?.precio_base ?? 0,
      imagen_url: producto?.imagen_url ?? "",
      stock: producto?.stock ?? 0,
      disponible: producto?.disponible ?? true,
    } satisfies ProductoInput,
    onSubmit: ({ value }) => onGuardar(value),
  });

  return (
    <Modal
      isOpen
      titulo={producto ? "Editar producto" : "Nuevo producto"}
      onClose={onCerrar}
      onSubmit={() => form.handleSubmit()}
      errorMessage={error}
    >
      <form.Field
        name="nombre"
        validators={{ onChange: ({ value }) => (!value.trim() ? "El nombre es obligatorio" : undefined) }}
      >
        {(field) => <Input field={field} label="Nombre" />}
      </form.Field>

      <form.Field name="descripcion">
        {(field) => <Input field={field} label="Descripción" multilinea />}
      </form.Field>

      <form.Field name="categoria_id">
        {(field) => (
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Categoría</span>
            <select
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              className={claseCampo}
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="precio_base"
          validators={{ onChange: ({ value }) => (Number.isNaN(value) || value < 0 ? "Precio inválido" : undefined) }}
        >
          {(field) => (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Precio</span>
              <input
                type="number"
                step="0.01"
                value={Number.isNaN(field.state.value) ? "" : field.state.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                className={claseCampo}
              />
              {field.state.meta.errors.length > 0 && (
                <span className="text-sm text-red-600">{field.state.meta.errors.join(", ")}</span>
              )}
            </label>
          )}
        </form.Field>

        <form.Field
          name="stock"
          validators={{ onChange: ({ value }) => (Number.isNaN(value) || value < 0 ? "Stock inválido" : undefined) }}
        >
          {(field) => (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Stock</span>
              <input
                type="number"
                value={Number.isNaN(field.state.value) ? "" : field.state.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                className={claseCampo}
              />
              {field.state.meta.errors.length > 0 && (
                <span className="text-sm text-red-600">{field.state.meta.errors.join(", ")}</span>
              )}
            </label>
          )}
        </form.Field>
      </div>

      <form.Field name="imagen_url">
        {(field) => <Input field={field} label="URL de la imagen" />}
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
  );
}

export default ProductoModal;
