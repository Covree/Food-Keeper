import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>A carregar...</div>;
  }

  // 1. Se não estiver autenticado, vai para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Se a rota exige roles específicas e a role do utilizador não for permitida
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />; // Redireciona para o Dashboard principal
  }

  // Permite renderizar as rotas filhas (com Outlet ou children)
  return children ? children : <Outlet />;
};