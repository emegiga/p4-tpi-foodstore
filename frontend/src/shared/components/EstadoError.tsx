interface EstadoErrorProps {
  mensaje: string;
}

function EstadoError({ mensaje }: EstadoErrorProps) {
  return (
    <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700">
      {mensaje}
    </div>
  );
}

export default EstadoError;