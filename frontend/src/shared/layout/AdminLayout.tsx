import { NavLink, Outlet } from "react-router-dom";

const secciones = [
  { to: "/admin/resumen", texto: "Resumen" },
  { to: "/admin/categorias", texto: "Categorías" },
  { to: "/admin/productos", texto: "Productos" },
  { to: "/admin/pedidos", texto: "Pedidos" },
  { to: "/admin/usuarios", texto: "Usuarios" },
];

// Pestañas del panel de administración
function AdminLayout() {
  return (
    <div>
      <nav className="mb-6 flex gap-2 border-b border-gray-200">
        {secciones.map((s) => (
          <NavLink
            key={s.to}
            to={s.to}
            className={({ isActive }) =>
              `px-4 py-2 ${isActive ? "border-b-2 border-orange-600 font-semibold text-orange-700" : "text-gray-600"}`
            }
          >
            {s.texto}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}

export default AdminLayout;
