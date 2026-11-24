interface PaginacionProps {
  pagina: number; // empieza en 0
  totalPaginas: number;
  onCambiar: (pagina: number) => void;
}

function Paginacion({ pagina, totalPaginas, onCambiar }: PaginacionProps) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-3 text-sm">
      <button
        onClick={() => onCambiar(pagina - 1)}
        disabled={pagina === 0}
        className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50"
      >
        Anterior
      </button>
      <span>
        Página {pagina + 1} de {totalPaginas}
      </span>
      <button
        onClick={() => onCambiar(pagina + 1)}
        disabled={pagina + 1 >= totalPaginas}
        className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}

export default Paginacion;