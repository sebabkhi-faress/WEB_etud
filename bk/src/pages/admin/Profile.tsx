import { useState, useEffect } from 'react';
import { CheckCircle2, Mail, Phone, Shield, Save, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { userService, accountService } from '@/services/supabase.service';

const AdminProfile = () => {
  const { profile, account } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userFormData, setUserFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  });
  const [accountFormData, setAccountFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (profile) {
      setUserFormData({
        firstname: profile.firstname || '',
        lastname: profile.lastname || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
    }
    
    if (account) {
      setAccountFormData({
        username: account.username || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [profile, account]);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setLoading(true);
    try {
      const userData = {
        firstname: userFormData.firstname,
        lastname: userFormData.lastname,
        email: userFormData.email,
        phone: userFormData.phone,
      };
      
      const { error } = await userService.update(profile.id_user, userData);
      if (error) throw error;
      
      toast.success("Profile updated successfully", {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    
    if (accountFormData.password && accountFormData.password !== accountFormData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      const accountData: { username: string; password?: string } = {
        username: accountFormData.username,
      };
      
      if (accountFormData.password) {
        accountData.password = accountFormData.password;
      }
      
      const { error } = await accountService.update(account.id, accountData);
      if (error) throw error;
      
      toast.success("Account updated successfully", {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
      
      setAccountFormData({
        ...accountFormData,
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error("Failed to update account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account settings
          </p>
        </div>
        <Badge variant="outline" className="capitalize px-3 py-1">
          <Shield className="h-3 w-3 mr-1" />
          {profile?.role}
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <form onSubmit={handleUserSubmit}>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-muted/50 rounded-lg">
                  <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-800">
                    {profile?.firstname?.[0]}{profile?.lastname?.[0]}
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-medium">{profile?.firstname} {profile?.lastname}</h3>
                    <p className="text-muted-foreground mt-1">{profile?.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstname" className="text-sm font-medium">First Name</label>
                    <Input
                      id="firstname"
                      value={userFormData.firstname}
                      onChange={(e) => setUserFormData({ ...userFormData, firstname: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastname" className="text-sm font-medium">Last Name</label>
                    <Input
                      id="lastname"
                      value={userFormData.lastname}
                      onChange={(e) => setUserFormData({ ...userFormData, lastname: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        value={userFormData.email}
                        onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        className="pl-10"
                        value={userFormData.phone}
                        onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your account credentials</CardDescription>
            </CardHeader>
            <form onSubmit={handleAccountSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">Username</label>
                  <Input
                    id="username"
                    value={accountFormData.username}
                    onChange={(e) => setAccountFormData({ ...accountFormData, username: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">New Password</label>
                    <Input
                      id="password"
                      type="password"
                      value={accountFormData.password}
                      onChange={(e) => setAccountFormData({ ...accountFormData, password: e.target.value })}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={accountFormData.confirmPassword}
                      onChange={(e) => setAccountFormData({ ...accountFormData, confirmPassword: e.target.value })}
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Update Account
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProfile;