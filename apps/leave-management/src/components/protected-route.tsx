import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireManager?: boolean;
}

export function ProtectedRoute({ children, requireManager = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireManager && !user?.isManager) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
