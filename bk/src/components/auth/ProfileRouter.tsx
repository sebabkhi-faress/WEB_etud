import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProfileRouter = () => {
  const { profile, isLoading, roleLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Only redirect if we're not already redirecting, not loading, and have role info
    if (!isLoading && roleLoaded && profile && !isRedirecting) {
      setIsRedirecting(true);
      
      let targetPath = '';
      
      // Determine target path based on role
      if (profile.role === 'Administrator') {
        targetPath = '/profile/admin';
      } else if (profile.role === 'Teacher') {
        targetPath = '/teacher/profile';
      } else if (profile.role === 'Pedagogic') {
        targetPath = '/pedagogic/profile';
      } else if (profile.role === 'Responsible') {
        targetPath = '/responsible/profile';
      } else {
        targetPath = '/login';
      }
      
      // Only navigate if we're not already at the target path
      if (location.pathname !== targetPath) {
        navigate(targetPath, { replace: true });
      } else {
        setIsRedirecting(false);
      }
    }
  }, [profile, isLoading, roleLoaded, navigate, location.pathname, isRedirecting]);

  // Show loading while redirecting
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default ProfileRouter;



