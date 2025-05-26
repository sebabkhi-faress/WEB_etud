import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/ThemeToggle";
import { User, LockKeyhole, GraduationCap } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, profile, isLoading: authLoading, roleLoaded, getRoleRoute } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && roleLoaded && profile) {
      navigate(getRoleRoute(), { replace: true });
    }
  }, [authLoading, roleLoaded, profile, getRoleRoute, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(formData.username, formData.password);
      toast({ title: "Success", description: "You have been successfully logged in." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950">
      {/* Header with logo and theme toggle */}
      <header className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-blue-100 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-500 dark:bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">Umbb   Management</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Login Form */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-slate-700"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent mb-8 text-center">Sign in to your account</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700 dark:text-slate-200 font-medium">Username</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-400">
                  <User className="h-5 w-5" />
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="pl-10 h-12 bg-blue-50 dark:bg-slate-700/60 border-blue-100 dark:border-slate-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-200 font-medium">Password</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-400">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="pl-10 h-12 bg-blue-50 dark:bg-slate-700/60 border-blue-100 dark:border-slate-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 dark:shadow-blue-500/10 transition-all duration-200 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}