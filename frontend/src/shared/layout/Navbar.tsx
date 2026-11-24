import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

function Navbar() {
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);
  const cantidadEnCarrito = useCartStore((s) => s.items.reduce((suma, i) => suma + i.cantidad, 0));
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-500 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold">
          Food Store
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-blue-300">
            Catálogo
          </Link>
          <Link to="/carrito" className="hover:text-blue-300">
            Carrito ({cantidadEnCarrito})
          </Link>

          {usuario ? (
            <>
              {usuario.role !== "admin" && (
                <Link to="/mis-pedidos" className="hover:text-blue-300">
                  Mis pedidos
                </Link>
              )}
              {usuario.role === "admin" && (
                <Link to="/admin/resumen" className="hover:text-blue-300">
                  Panel admin
                </Link>
              )}
              <span className="text-sm">
                {usuario.full_name} ({usuario.role})
              </span>
              <button
                onClick={cerrarSesion}
                className="rounded bg-white px-3 py-1 text-blue-600 hover:bg-blue-100"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-300">
                Iniciar sesión
              </Link>
              <Link to="/register" className="hover:text-blue-300">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;