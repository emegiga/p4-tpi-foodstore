import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import UnauthorizedPage from "@/features/auth/pages/UnauthorizedPage";
import AdminCategoriasPage from "@/features/categorias/pages/AdminCategoriasPage";
import AdminPedidosPage from "@/features/pedidos/pages/AdminPedidosPage";
import AdminResumenPage from "@/features/pedidos/pages/AdminResumenPage";
import AdminProductosPage from "@/features/productos/pages/AdminProductosPage";
import CatalogoPage from "@/features/productos/pages/CatalogoPage";
import AdminUsuariosPage from "@/features/usuarios/pages/AdminUsuariosPage";
import AdminLayout from "@/shared/layout/AdminLayout";
import MainLayout from "@/shared/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* públicas */}
          <Route path="/" element={<CatalogoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* con sesión: se agregan en el paso 6 */}

          {/* solo admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="resumen" replace />} />
              <Route path="resumen" element={<AdminResumenPage />} />
              <Route path="categorias" element={<AdminCategoriasPage />} />
              <Route path="productos" element={<AdminProductosPage />} />
              <Route path="pedidos" element={<AdminPedidosPage />} />
              <Route path="usuarios" element={<AdminUsuariosPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
