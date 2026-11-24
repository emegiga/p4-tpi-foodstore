import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

// Junta la Navbar con el contenido de la ruta activa
function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;