import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsPage } from "./pages/products/ProductsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { BatchesPage } from "./pages/batches/BatchesPage";
import { MovementsPage } from "./pages/movements/MovementsPage";
import { AlertsPage } from "./pages/AlertsPage";

// 1. Importação da nova página de gestão de utilizadores
import UsersPage from "./pages/admin/UsersPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          {/* Rotas Comuns Protegidas (Acessíveis a utilizadores autenticados) */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/produtos" element={<ProductsPage />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/lotes" element={<BatchesPage />} />
            <Route path="/movimentacoes" element={<MovementsPage />} />
            <Route path="/alertas" element={<AlertsPage />} />
          </Route>

          {/* 2. Rota Exclusiva de ADMIN para alterar cargos/roles */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/usuarios" element={<UsersPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}