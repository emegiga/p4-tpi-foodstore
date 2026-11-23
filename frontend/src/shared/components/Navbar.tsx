import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { useThemeStore } from "@/store/themeStore";

function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const darkMode = useThemeStore((state) => state.darkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const navigate = useNavigate();

  // aplica la clase "dark" en <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const cerrarSesion = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-500 text-white dark:bg-blue-900">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-bold">Food Store</span>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/categories" className="hover:text-blue-300">
                Categorías
              </Link>
              <Link to="/products" className="hover:text-blue-300">
                Productos
              </Link>
              <Link to="/ingredients" className="hover:text-blue-300">
                Ingredientes
              </Link>
              {isAdmin && (
                <Link to="/admin/users" className="hover:text-blue-300">
                  Usuarios
                </Link>
              )}
              <span className="text-sm">
                {user.nombre} {user.apellido} ({user.roles.join(", ")})
              </span>
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

          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded bg-blue-700 hover:bg-blue-800"
          >
            {darkMode ? "Modo claro" : "Modo oscuro"}
          </button>

          {user && (
            <button
              onClick={cerrarSesion}
              className="px-3 py-1 rounded bg-white text-blue-600 hover:bg-blue-100"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
