import { Link, useNavigate } from "react-router-dom";
import EstadoVacio from "@/shared/components/EstadoVacio";
import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import { useCartStore } from "@/store/cartStore";

function CarritoPage() {
  const items = useCartStore((s) => s.items);
  const quitar = useCartStore((s) => s.quitar);
  const cambiarCantidad = useCartStore((s) => s.cambiarCantidad);
  const vaciar = useCartStore((s) => s.vaciar);
  const total = useCartStore((s) => s.total());
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-bold">Carrito</h1>
        <EstadoVacio mensaje="Tu carrito está vacío" />
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Carrito</h1>

      <Card>
        <table className="w-full text-left">
          <thead className="text-sm text-gray-500">
            <tr>
              <th className="py-2">Producto</th>
              <th className="py-2">Precio</th>
              <th className="py-2">Cantidad</th>
              <th className="py-2 text-right">Subtotal</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.producto_id} className="border-t border-gray-200">
                <td className="py-2">{item.nombre}</td>
                <td className="py-2">$ {item.precio_unitario.toLocaleString("es-AR")}</td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
                      className="rounded bg-gray-200 px-2"
                    >
                      −
                    </button>
                    <span>{item.cantidad}</span>
                    <button
                      onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
                      className="rounded bg-gray-200 px-2"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-2 text-right">
                  $ {(item.precio_unitario * item.cantidad).toLocaleString("es-AR")}
                </td>
                <td className="py-2 text-right">
                  <button onClick={() => quitar(item.producto_id)} className="text-sm text-red-600 hover:underline">
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <Button variante="secundario" onClick={vaciar}>
            Vaciar carrito
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold">Total: $ {total.toLocaleString("es-AR")}</span>
            <Button onClick={() => navigate("/checkout")}>Continuar</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CarritoPage;