interface SkeletonProps {
  cantidad?: number; // cuántas tarjetas grises mostrar mientras carga
}

function Skeleton({ cantidad = 6 }: SkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: cantidad }, (_, i) => (
        <div key={i} className="animate-pulse rounded-lg bg-white p-4 shadow">
          <div className="mb-3 h-32 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/3 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;