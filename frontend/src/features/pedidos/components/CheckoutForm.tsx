import { useForm } from "@tanstack/react-form";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import type { FormaPago } from "../types/pedido.types";

export interface DatosCheckout {
  direccion_entrega: string;
  forma_pago: FormaPago;
  notas: string;
}

interface CheckoutFormProps {
  enviando: boolean;
  onConfirmar: (datos: DatosCheckout) => void;
}

const valoresIniciales: DatosCheckout = { direccion_entrega: "", forma_pago: "EFECTIVO", notas: "" };

function CheckoutForm({ enviando, onConfirmar }: CheckoutFormProps) {
  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) => onConfirmar(value),
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <form.Field
        name="direccion_entrega"
        validators={{
          onChange: ({ value }) => {
            const largo = value.trim().length;
            if (largo < 5) return "Mínimo 5 caracteres";
            if (largo > 200) return "Máximo 200 caracteres";
            return undefined;
          },
        }}
      >
        {(field) => <Input field={field} label="Dirección de entrega" />}
      </form.Field>

      <form.Field name="forma_pago">
        {(field) => (
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Forma de pago</span>
            <select
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value as FormaPago)}
              className="rounded border border-gray-300 px-3 py-2"
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </label>
        )}
      </form.Field>

      <form.Field name="notas">
        {(field) => <Input field={field} label="Notas (opcional)" multilinea />}
      </form.Field>

      <Button type="submit" disabled={enviando}>
        {enviando ? "Enviando..." : "Confirmar pedido"}
      </Button>
    </form>
  );
}

export default CheckoutForm;