import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/database.types';
import { userService, accountService } from '@/services/user.service';
import { CheckCircle2, LogOut } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

// Define role-based routes
export const ROLE_ROUTES = {
  'Administrator': '/admin/dashboard',
  'Teacher': '/teacher/dashboard',
  'Pedagogic': '/pedagogic/dashboard',
  'Responsible': '/responsible/dashboard'
} as const;

export type UserRole = keyof typeof ROLE_ROUTES;

interface AuthContextType {
  user: SupabaseUser | null;
  profile: User | null;
  account: { id: number, username: string } | null;
  isLoading: boolean;
  roleLoaded: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  getRoleRoute: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [account, setAccount] = useState<{ id: number, username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roleLoaded, setRoleLoaded] = useState(false);
  const { toast } = useToast();

  // Helper functions for role-based access
  const hasRole = (role: UserRole): boolean => {
    return profile?.role === role;
  };

  const getRoleRoute = (): string => {
    return profile?.role ? ROLE_ROUTES[profile.role as UserRole] || '/login' : '/login';
  };

  const clearSession = () => {
    localStorage.removeItem('account');
    localStorage.removeItem('profile');
    setAccount(null);
    setProfile(null);
    setUser(null);
  };

  useEffect(() => {
    const loadUserSession = async () => {
      setIsLoading(true);
      try {
        // Load stored account from localStorage
        const storedAccount = localStorage.getItem('account');
        const storedProfile = localStorage.getItem('profile');
        
        if (storedAccount && storedProfile) {
          const accountData = JSON.parse(storedAccount);
          const profileData = JSON.parse(storedProfile);
          
          // Validate session
          try {
            const userProfile = await userService.getByAccountId(accountData.id);
            if (userProfile && userProfile.id_user === profileData.id_user) {
              setAccount(accountData);
              setProfile(userProfile);
            } else {
              clearSession();
            }
          } catch (error) {
            console.error('Error validating session:', error);
            clearSession();
          }
        } else {
          clearSession();
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        clearSession();
      } finally {
        setIsLoading(false);
        setRoleLoaded(true);
      }
    };

    loadUserSession();
    
    // Keep this for compatibility with Supabase Auth if needed later
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const handleSignIn = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data: accountData, error } = await supabase
        .from('account')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) {
        throw new Error('Invalid username or password');
      }
      
      // Verify password (in a real app, you'd use proper password hashing)
      if (accountData.password !== password) {
        throw new Error('Invalid username or password');
      }
      
      const accountInfo = {
        id: accountData.id_account,
        username: accountData.username,
      };
      
      setAccount(accountInfo);
      localStorage.setItem('account', JSON.stringify(accountInfo));
      
      // Fetch user profile
      if (accountData.id_account) {
        try {
          const userProfile = await userService.getByAccountId(accountData.id_account);
          if (userProfile) {
            setProfile(userProfile);
            localStorage.setItem('profile', JSON.stringify(userProfile));
            setRoleLoaded(true);

            // Show success message
            toast({
              title: "Welcome back!",
              description: `Signed in as ${userProfile.firstname} ${userProfile.lastname}`,
            });

            // Do NOT redirect here. Let the login page handle redirection after profile is set.
          } else {
            throw new Error('User profile not found');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          clearSession();
          throw new Error('Error loading user profile');
        }
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed!",
        description: error.message || "Please check your credentials.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      clearSession();
      await supabase.auth.signOut();
      
      sonnerToast.error("You have been signed out.", {
        description: "You have successfully signed out.",
        duration: 2500,
        icon: <LogOut className="text-red-600" />,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = useMemo(() => ({
    user,
    profile,
    account,
    isLoading,
    roleLoaded,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isAuthenticated: !!profile && !!account,
    hasRole,
    getRoleRoute
  }), [user, profile, account, isLoading, roleLoaded]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};






