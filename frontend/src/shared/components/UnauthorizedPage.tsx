import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold mb-2">Acceso denegado</h1>
      <p className="mb-6">No tenés permisos para ver esta página...</p>
      <Link to="/categories" className="text-blue-600 hover:underline">
        Volver a categorías
      </Link>
    </main>
  );
}

export default UnauthorizedPage;