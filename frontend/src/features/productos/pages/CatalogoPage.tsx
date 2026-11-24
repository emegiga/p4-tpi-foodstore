import { useState, type FormEvent } from "react";
import { useCategorias } from "@/features/categorias/hooks/useCategorias";
import { handleApiError } from "@/shared/api/handleApiError";
import EstadoError from "@/shared/components/EstadoError";
import EstadoVacio from "@/shared/components/EstadoVacio";
import Paginacion from "@/shared/components/Paginacion";
import Skeleton from "@/shared/components/Skeleton";
import Button from "@/shared/ui/Button";
import { useCartStore } from "@/store/cartStore";
import ProductoCard from "../components/ProductoCard";
import { useProductos } from "../hooks/useProductos";
import type { Producto } from "../types/producto.types";

const POR_PAGINA = 6;

function CatalogoPage() {
  const [pagina, setPagina] = useState(0);
  const [texto, setTexto] = useState(""); // lo que se escribe en el buscador
  const [search, setSearch] = useState(""); // lo que se busca al apretar "Buscar"
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined);

  // paginación en el servidor: skip = página × limit
  const { data, isLoading, isError, error } = useProductos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
    search: search || undefined,
    categoria_id: categoriaId,
  });
  const { data: categorias = [] } = useCategorias();
  const agregar = useCartStore((s) => s.agregar);

  const buscar = (e: FormEvent) => {
    e.preventDefault();
    setSearch(texto.trim());
    setPagina(0);
  };

  const cambiarCategoria = (valor: string) => {
    setCategoriaId(valor ? Number(valor) : undefined);
    setPagina(0);
  };

  const agregarAlCarrito = (producto: Producto) => {
    agregar({ producto_id: producto.id, nombre: producto.nombre, precio_unitario: producto.precio_base });
  };

  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Catálogo</h1>

      <div className="mb-6 flex flex-wrap gap-3">
        <form onSubmit={buscar} className="flex gap-2">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por nombre..."
            className="rounded border border-gray-300 px-3 py-2"
          />
          <Button type="submit" variante="secundario">
            Buscar
          </Button>
        </form>

        <select
          value={categoriaId ?? ""}
          onChange={(e) => cambiarCategoria(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <Skeleton cantidad={POR_PAGINA} />}
      {isError && <EstadoError mensaje={handleApiError(error, "Error al cargar el catálogo")} />}
      {data && data.items.length === 0 && <EstadoVacio mensaje="No se encontraron productos" />}

      {data && data.items.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} onAgregar={agregarAlCarrito} />
            ))}
          </div>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
        </>
      )}
    </div>
  );
}

export default CatalogoPage;