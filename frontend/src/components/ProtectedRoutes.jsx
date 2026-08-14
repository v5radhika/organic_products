import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export const CustomerRoute = () => {
  const { user, isCustomer } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isCustomer) return <Navigate to="/owner/dashboard" replace />;
  return <Outlet />;
};

export const OwnerRoute = () => {
  const { user, isOwner } = useAuth();
  if (!user) return <Navigate to="/owner-login" replace />;
  if (!isOwner) return <Navigate to="/" replace />;
  return <Outlet />;
};
