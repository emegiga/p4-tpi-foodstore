interface EmptyStateProps {
  mensaje: string;
}

function EmptyState({ mensaje }: EmptyStateProps) {
  return (
    <div className="rounded-lg border-2 border-dashed border-slate-300 py-10 text-center text-slate-500">
      {mensaje}
    </div>
  );
}

export default EmptyState;