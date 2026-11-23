import { Navigate, Route, Routes } from "react-router-dom";
import { AdminUsersPage, LoginPage, RegisterPage } from "@/features/auth";
import { CategoriesPage } from "@/features/categories";
import { IngredientsPage } from "@/features/ingredients";
import { ProductsPage } from "@/features/products";
import Navbar from "@/shared/components/Navbar";
import UnauthorizedPage from "@/shared/components/UnauthorizedPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <Routes>
        {/* públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* cualquier usuario autenticado */}
        <Route element={<ProtectedRoute />}>
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/ingredients" element={<IngredientsPage />} />
        </Route>

        {/* solo admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>

        {/* otras rutas van a categorías */}
        <Route path="*" element={<Navigate to="/categories" replace />} />
      </Routes>
    </div>
  );
}

export default AppRouter;
