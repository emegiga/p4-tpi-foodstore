interface EstadoVacioProps {
  mensaje: string;
}

function EstadoVacio({ mensaje }: EstadoVacioProps) {
  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 py-10 text-center text-gray-500">
      {mensaje}
    </div>
  );
}

export default EstadoVacio;