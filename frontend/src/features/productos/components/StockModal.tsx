import { useForm } from "@tanstack/react-form";
import Modal from "@/shared/ui/Modal";
import type { Producto, StockInput } from "../types/producto.types";

interface StockModalProps {
  producto: Producto;
  error: string | null;
  onGuardar: (data: StockInput) => void;
  onCerrar: () => void;
}

function StockModal({ producto, error, onGuardar, onCerrar }: StockModalProps) {
  const form = useForm({
    defaultValues: { stock: producto.stock, disponible: producto.disponible } satisfies StockInput,
    onSubmit: ({ value }) => onGuardar(value),
  });

  return (
    <Modal
      isOpen
      titulo={`Stock de ${producto.nombre}`}
      onClose={onCerrar}
      onSubmit={() => form.handleSubmit()}
      errorMessage={error}
    >
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
              className="rounded border border-gray-300 px-3 py-2"
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
  );
}

export default StockModal;
