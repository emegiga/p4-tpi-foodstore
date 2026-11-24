import { Link, useNavigate } from "react-router-dom";
import { handleApiError } from "@/shared/api/handleApiError";
import EstadoError from "@/shared/components/EstadoError";
import EstadoVacio from "@/shared/components/EstadoVacio";
import Card from "@/shared/ui/Card";
import { useCartStore } from "@/store/cartStore";
import CheckoutForm, { type DatosCheckout } from "../components/CheckoutForm";
import { useAuthStore } from "@/store/authStore";
import { useCrearPedido } from "../hooks/useCrearPedido";

function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const vaciar = useCartStore((s) => s.vaciar);
  const crearPedido = useCrearPedido();
  const navigate = useNavigate();

 const usuario = useAuthStore((s) => s.usuario);

  const confirmar = (datos: DatosCheckout) => {
    crearPedido.mutate(
      {
        items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
        forma_pago: datos.forma_pago,
        direccion_entrega: datos.direccion_entrega.trim(),
        notas: datos.notas.trim() || null,
      },
      {
        onSuccess: () => {
          vaciar();
          navigate(usuario?.role === "admin" ? "/admin/pedidos" : "/mis-pedidos");
        },
      },
    );
  };

  if (items.length === 0) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-bold">Confirmar pedido</h1>
        <EstadoVacio mensaje="No hay productos en el carrito" />
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h1 className="mb-4 text-2xl font-bold">Confirmar pedido</h1>
        {crearPedido.isError && (
          <EstadoError mensaje={handleApiError(crearPedido.error, "No se pudo crear el pedido")} />
        )}
        <CheckoutForm enviando={crearPedido.isPending} onConfirmar={confirmar} />
      </div>

      <Card className="h-fit">
        <h2 className="mb-3 font-semibold">Resumen</h2>
        {items.map((item) => (
          <p key={item.producto_id} className="flex justify-between text-sm">
            <span>
              {item.cantidad} × {item.nombre}
            </span>
            <span>$ {(item.precio_unitario * item.cantidad).toLocaleString("es-AR")}</span>
          </p>
        ))}
        <p className="mt-3 flex justify-between border-t border-gray-200 pt-3 font-bold">
          <span>Total</span>
          <span>$ {total.toLocaleString("es-AR")}</span>
        </p>
      </Card>
    </div>
  );
}

export default CheckoutPage;