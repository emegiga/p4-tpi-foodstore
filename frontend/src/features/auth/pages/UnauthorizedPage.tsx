import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <div className="py-12 text-center">
      <h1 className="mb-2 text-2xl font-bold">Acceso denegado</h1>
      <p className="mb-6 text-gray-600">No tenés permisos para ver esta página</p>
      <Link to="/" className="text-blue-600 hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}

export default UnauthorizedPage;