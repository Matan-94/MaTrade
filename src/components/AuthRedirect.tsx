import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

interface AuthRedirectProps {
  redirectTo?: string;
}

export const AuthRedirect: React.FC<AuthRedirectProps> = ({ redirectTo = '/dashboard' }) => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <Navigate to={redirectTo} replace /> : <Outlet />;
};
