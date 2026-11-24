import Button from "@/shared/ui/Button";
import Card from "@/shared/ui/Card";
import type { Producto } from "../types/producto.types";

interface ProductoCardProps {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
}

function ProductoCard({ producto, onAgregar }: ProductoCardProps) {
  const sinStock = producto.stock === 0 || !producto.disponible;

  return (
    <Card className="flex flex-col">
      {producto.imagen_url ? (
        <img src={producto.imagen_url} alt={producto.nombre} className="mb-3 h-40 w-full rounded object-cover" />
      ) : (
        <div className="mb-3 flex h-40 items-center justify-center rounded bg-gray-100 text-gray-400">
          Sin imagen
        </div>
      )}
      <p className="text-xs text-gray-500">{producto.categoria.nombre}</p>
      <h2 className="font-semibold">{producto.nombre}</h2>
      <p className="mb-3 flex-1 text-sm text-gray-600">{producto.descripcion}</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">$ {producto.precio_base.toLocaleString("es-AR")}</span>
        <Button className="py-1" disabled={sinStock} onClick={() => onAgregar(producto)}>
          {sinStock ? "Sin stock" : "Agregar al carrito"}
        </Button>
      </div>
    </Card>
  );
}

export default ProductoCard;