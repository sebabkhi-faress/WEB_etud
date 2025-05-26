import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/context/ThemeContext';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  LogOut,
  Menu,
  Settings,
  User,
  Home,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  title: string;
  path: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  title,
  path,
  icon,
  isExpanded,
  isActive
}) => {
  return (
    <Link
      to={path}
      className={`
        flex items-center px-4 py-3 my-1 rounded-lg font-sans font-medium antialiased transition-colors duration-200
        ${isActive
          ? 'bg-[#2563EB] text-white dark:bg-[#2563EB] dark:text-white shadow-sm'
          : 'text-gray-900 dark:text-gray-100 hover:bg-[#2563EB]/10 dark:hover:bg-[#2563EB]/30 hover:text-[#2563EB] dark:hover:text-white'}
      `}
    >
      <div className="flex items-center">
        <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>{icon}</span>
        {isExpanded && <span className="ml-3 truncate">{title}</span>}
      </div>
    </Link>
  );
};

interface TeacherSidebarLayoutProps {
  children: React.ReactNode;
}

const TeacherSidebarLayout: React.FC<TeacherSidebarLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getInitials = () => {
    if (!profile) return '';
    return `${profile.firstname?.[0] || ''}${profile.lastname?.[0] || ''}`;
  };

  const sidebarItems = [
    {
      title: 'Dashboard',
      path: '/teacher/dashboard',
      icon: <Home size={20} className="transition-colors duration-300" />
    },
    {
      title: 'Schedule',
      path: '/teacher/schedule',
      icon: <Calendar size={20} className="transition-colors duration-300" />
    },
    {
      title: 'Assignments',
      path: '/teacher/assignments',
      icon: <FileText size={20} className="transition-colors duration-300" />
    },
    {
      title: 'Preferences',
      path: '/teacher/preferences',
      icon: <Settings size={20} className="transition-colors duration-300" />
    }
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderSidebar = () => (
    <div
      className={`bg-white dark:bg-[#0a0a23] text-card-foreground border-r border-border flex flex-col h-full transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      } font-sans antialiased`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {isSidebarOpen && (
          <Link to="/teacher/dashboard" className="text-xl font-bold text-[#2563EB] dark:text-white transition-colors hover:text-[#2563EB] dark:hover:text-[#b3b3ff]">
            Teacher Portal
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={`transition-all duration-200 hover:bg-muted ${!isSidebarOpen ? 'mx-auto' : ''}`}
        >
          {isSidebarOpen ? (
            <ChevronLeft size={20} className="transition-transform duration-300 hover:scale-110" />
          ) : (
            <ChevronRight size={20} className="transition-transform duration-300 hover:scale-110" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.path}
            title={item.title}
            path={item.path}
            icon={item.icon}
            isExpanded={isSidebarOpen}
            isActive={location.pathname === item.path}
          />
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={`w-full justify-start font-sans font-medium antialiased text-muted-foreground transition-colors duration-200 rounded-lg px-4 py-3
            hover:text-white hover:bg-red-500 dark:hover:bg-red-600 dark:hover:text-white
            ${!isSidebarOpen && 'justify-center'}`}
          onClick={handleSignOut}
        >
          <LogOut size={20} className={`transition-transform duration-300 hover:scale-110 ${isSidebarOpen ? 'mr-2' : ''}`} />
          {isSidebarOpen && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {isMobile ? (
        <>
          <div
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={closeMobileMenu}
          />
          <div
            className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 transform ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {renderSidebar()}
          </div>
        </>
      ) : (
        renderSidebar()
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-card shadow-sm px-6 py-3 flex justify-between items-center border-b border-border">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="md:hidden transition-transform duration-200 hover:bg-muted"
            >
              <Menu size={20} className="transition-transform duration-300 hover:scale-110" />
            </Button>
          )}

          <div className="font-medium text-foreground">
            {location.pathname.split('/').pop()?.charAt(0).toUpperCase() + location.pathname.split('/').pop()?.slice(1) || 'Dashboard'}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="transition-all duration-200 hover:bg-muted"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-gray-700" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 transition-all duration-200 hover:bg-muted px-3">
                  <Avatar className="h-8 w-8 transition-transform duration-300 hover:scale-105">
                    <AvatarFallback className="bg-primary-100 text-primary-800">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  {!isMobile && (
                    <>
                      <div className="text-sm font-medium text-left ml-1 flex flex-col min-w-0 max-w-[200px]">
                        <span className="truncate">{profile?.firstname} {profile?.lastname}</span>
                        <span className="text-xs text-muted-foreground capitalize truncate">{profile?.role}</span>
                      </div>
                      <ChevronDown size={16} className="text-muted-foreground transition-transform duration-300 group-hover:rotate-180 flex-shrink-0" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">My Account</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center cursor-pointer transition-colors duration-200 hover:bg-muted hover:text-primary" asChild>
                  <Link to="/teacher/profile">
                    <User size={16} className="mr-2 text-muted-foreground" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-700"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} className="mr-2 text-muted-foreground" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default TeacherSidebarLayout;







