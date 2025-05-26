import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useEffect } from "react";

// Keep these imports outside the Administrator folder
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

// Add imports for Administrator components
import AdministratorSidebarLayout from "./components/layout/AdministratorSidebarLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProfile from '@/pages/admin/Profile';
import Levels from '@/pages/admin/Levels';
import Modules from '@/pages/admin/Modules';
import Formations from '@/pages/admin/Formations';
import Categories from '@/pages/admin/Categories';
import Semesters from '@/pages/admin/Semesters';
import Units from '@/pages/admin/Units';
import Sections from '@/pages/admin/Sections';
import Groups from '@/pages/admin/Groups';
import Users from '@/pages/admin/Users';

// Add imports for Teacher components
import TeacherDashboard from "./pages/Teacher/Dashboard";
import TeacherSidebarLayout from "./components/layout/TeacherSidebarLayout";
import ProfileRouter from '@/components/auth/ProfileRouter';
import TeacherProfile from '@/pages/Teacher/Profile';
import TeacherPreferences from '@/pages/Teacher/Preferences';
import TeacherSchedule from './pages/Teacher/Schedule';
import TeacherAssignments from './pages/Teacher/Assignments';

const queryClient = new QueryClient();

const RoleBasedRedirect = () => {
  const { profile, isLoading, roleLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading && roleLoaded && profile) {
      let targetPath = '';
      
      // Redirect based on user role to their specific dashboard
      switch (profile.role) {
        case 'Administrator':
          targetPath = '/admin/dashboard';
          break;
        case 'Teacher':
          targetPath = '/teacher/dashboard';
          break;
        case 'Pedagogic':
          targetPath = '/pedagogic/dashboard';
          break;
        case 'Responsible':
          targetPath = '/responsible/dashboard';
          break;
        default:
          targetPath = '/login';
      }
      
      // Only redirect if we're not already at the target path
      if (location.pathname !== targetPath) {
        navigate(targetPath, { replace: true });
      }
    } else if (!isLoading && roleLoaded && !profile) {
      // If no profile and not at login, redirect to login
      if (location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    }
  }, [profile, isLoading, roleLoaded, navigate, location.pathname]);
  
  // Show loading spinner while authentication is in progress
  if (isLoading || !roleLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If we have a profile but no role, show an error
  if (profile && !profile.role) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Error</h2>
          <p className="text-gray-600">Your account does not have a valid role assigned.</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Root redirect */}
              <Route path="/" element={<RoleBasedRedirect />} />
              
              {/* Administrator routes with layout */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="Administrator">
                  <AdministratorSidebarLayout>
                    <Outlet />
                  </AdministratorSidebarLayout>
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="formations" element={<Formations />} />
                <Route path="levels" element={<Levels />} />
                <Route path="categories" element={<Categories />} />
                <Route path="semesters" element={<Semesters />} />
                <Route path="modules" element={<Modules />} />
                <Route path="units" element={<Units />} />
                <Route path="sections" element={<Sections />} />
                <Route path="groups" element={<Groups />} />
                <Route path="users" element={<Users />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>
              
              {/* Teacher routes */}
              <Route path="/teacher" element={
                <ProtectedRoute requiredRole="Teacher">
                  <TeacherSidebarLayout>
                    <Outlet />
                  </TeacherSidebarLayout>
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route path="profile" element={<TeacherProfile />} />
                <Route path="preferences" element={<TeacherPreferences />} />
                <Route path="schedule" element={<TeacherSchedule />} />
                <Route path="schedule/:tab" element={<TeacherSchedule />} />
                <Route path="assignments" element={<TeacherAssignments />} />
                <Route path="assignments/:tab" element={<TeacherAssignments />} />
              </Route>
              
              {/* Not found route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;




























