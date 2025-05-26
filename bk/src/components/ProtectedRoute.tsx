import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  layout?: React.ComponentType<{ children: ReactNode }>;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole,
  layout: Layout
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, roleLoaded, profile, hasRole, getRoleRoute } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      const returnTo = encodeURIComponent(location.pathname);
      window.location.href = `/login?returnTo=${returnTo}`;
    }
  }, [isLoading, isAuthenticated, location.pathname]);

  // Show loading spinner while checking auth state
  if (isLoading || !roleLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required but user doesn't have that role, redirect to their dashboard
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to={getRoleRoute()} replace />;
  }

  // If all checks pass, render the protected content with the specified layout
  return Layout ? <Layout>{children}</Layout> : <>{children}</>;
};
