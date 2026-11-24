import Card from "@/shared/ui/Card";

interface TarjetaResumenProps {
  titulo: string;
  valor: string | number;
}

function TarjetaResumen({ titulo, valor }: TarjetaResumenProps) {
  return (
    <Card>
      <p className="text-sm text-gray-500">{titulo}</p>
      <p className="mt-1 text-3xl font-bold">{valor}</p>
    </Card>
  );
}

export default TarjetaResumen;
