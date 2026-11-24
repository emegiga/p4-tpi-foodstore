import type { Pedido } from "../types/pedido.types";

interface PedidoDetalleProps {
  pedido: Pedido;
}

// Líneas del pedido con la copia de nombre y precio del momento de la compra
function PedidoDetalle({ pedido }: PedidoDetalleProps) {
  return (
    <div className="mt-3 border-t border-gray-200 pt-3 text-sm">
      <table className="w-full">
        <thead className="text-left text-gray-500">
          <tr>
            <th className="py-1">Producto</th>
            <th className="py-1">Precio</th>
            <th className="py-1">Cantidad</th>
            <th className="py-1 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {pedido.items.map((item) => (
            <tr key={item.producto_id}>
              <td className="py-1">{item.nombre_producto}</td>
              <td className="py-1">$ {item.precio_unitario.toLocaleString("es-AR")}</td>
              <td className="py-1">{item.cantidad}</td>
              <td className="py-1 text-right">$ {item.subtotal.toLocaleString("es-AR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-gray-600">
        Entrega: {pedido.direccion_entrega} · Pago: {pedido.forma_pago}
        {pedido.notas && ` · Notas: ${pedido.notas}`}
      </p>
    </div>
  );
}

export default PedidoDetalle;