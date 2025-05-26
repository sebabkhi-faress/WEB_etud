import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import SidebarLayout from '@/components/layout/AdministratorSidebarLayout';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: 'Administrator' | 'Teacher' | 'Pedagogic' | 'Responsible';
  layout?: React.ComponentType<{ children?: React.ReactNode }>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  layout: Layout = SidebarLayout
}) => {
  const { account, profile, isLoading, roleLoaded } = useAuth();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);

  useEffect(() => {
    // Only check authorization when we have the necessary data
    if (!isLoading && roleLoaded) {
      // If no account, redirect to login
      if (!account) {
        setShouldRedirect('/login');
        return;
      }

      // If role is required but user doesn't have that role, redirect
      if (requiredRole && profile && profile.role !== requiredRole) {
        // Redirect based on actual role
        if (profile.role === 'Administrator') {
          setShouldRedirect('/dashboard');
        } else if (profile.role === 'Teacher') {
          setShouldRedirect('/teacher/dashboard');
        } else if (profile.role === 'Pedagogic') {
          setShouldRedirect('/pedagogic/dashboard');
        } else if (profile.role === 'Responsible') {
          setShouldRedirect('/responsible/dashboard');
        } else {
          setShouldRedirect('/login');
        }
      } else {
        // Clear any previous redirect
        setShouldRedirect(null);
      }
    }
  }, [account, profile, isLoading, roleLoaded, requiredRole, location.pathname]);

  // Show a loading spinner while checking auth state
  if (isLoading || !roleLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If we need to redirect, do it
  if (shouldRedirect) {
    return <Navigate to={shouldRedirect} state={{ from: location }} replace />;
  }

  // If all checks pass, render the protected content with the specified layout
  return <Layout>{children}</Layout>;
}; 
