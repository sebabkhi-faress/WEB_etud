import { useState, useEffect } from 'react';
import {
  User, Plus, Search, Edit, Trash2, MoreHorizontal, Mail, Phone, Shield, Key, UsersIcon, Lock, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { userService, accountService } from '@/services/user.service';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import type { User as UserType, Account } from '@/types/database.types';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Component name is UsersPage to avoid conflict with the icon
const UsersPage = () => {
  // State for Users tab
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [userFormData, setUserFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    role: '',
    id_account: ''
  });
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isUserDeleteDialogOpen, setIsUserDeleteDialogOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // State for Accounts tab
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [accountFormData, setAccountFormData] = useState({
    username: '',
    password: '',
  });
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [isAccountDeleteDialogOpen, setIsAccountDeleteDialogOpen] = useState(false);
  const [accountSearchTerm, setAccountSearchTerm] = useState('');

  // Add this state for account search
  const [accountSearchQuery, setAccountSearchQuery] = useState('');
  const [filteredAccountOptions, setFilteredAccountOptions] = useState<Account[]>([]);

  // Shared state
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, accountsRes] = await Promise.all([
        userService.getAll().catch(err => {
          console.error('Error fetching users:', err);
          return [];
        }),
        accountService.getAll().catch(err => {
          console.error('Error fetching accounts:', err);
          return [];
        })
      ]);
      
      if (usersRes) {
        setUsers(usersRes as unknown as UserType[]);
      }
      
      if (accountsRes) {
        setAccounts(accountsRes as unknown as Account[]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Add this useEffect to filter accounts based on search query
  useEffect(() => {
    if (accounts.length > 0) {
      const filtered = accounts.filter(account => 
        account.username.toLowerCase().includes(accountSearchQuery.toLowerCase())
      );
      setFilteredAccountOptions(filtered);
    }
  }, [accountSearchQuery, accounts]);

  // User tab functions
  const handleUserDeleteClick = (user: UserType) => {
    setSelectedUser(user);
    setIsUserDeleteDialogOpen(true);
  };

  const handleUserDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      await userService.remove(selectedUser.id_user);
      toast.success(`User "${selectedUser.firstname} ${selectedUser.lastname}" deleted successfully`);
      fetchData();
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setIsUserDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      firstname: userFormData.firstname,
      lastname: userFormData.lastname,
      email: userFormData.email,
      phone: userFormData.phone,
      role: userFormData.role,
      id_account: parseInt(userFormData.id_account),
    };
    try {
      if (editingUser) {
        await userService.update(editingUser.id_user, userData);
        toast.success(`User "${userFormData.firstname} ${userFormData.lastname}" updated successfully`);
      } else {
        await userService.create(userData);
        toast.success(`User "${userFormData.firstname} ${userFormData.lastname}" created successfully`);
      }
      setIsUserDialogOpen(false);
      fetchData();
      resetUserForm();
    } catch {
      toast.error('Failed to save user');
    }
  };

  const handleUserEdit = (user: UserType) => {
    setEditingUser(user);
    setUserFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      id_account: user.id_account.toString(),
    });
    setIsUserDialogOpen(true);
  };

  const resetUserForm = () => {
    setUserFormData({
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      role: '',
      id_account: ''
    });
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user => {
    const searchString = `${user.firstname} ${user.lastname} ${user.email} ${user.role}`.toLowerCase();
    return searchString.includes(userSearchTerm.toLowerCase());
  });

  const getAccountUsername = (accountId: number) => {
    const account = accounts.find(acc => acc.id_account === accountId);
    return account ? account.username : 'N/A';
  };

  // Account tab functions
  const handleAccountDeleteClick = (account: Account) => {
    setSelectedAccount(account);
    setIsAccountDeleteDialogOpen(true);
  };

  const handleAccountDeleteConfirm = async () => {
    if (!selectedAccount) return;
    try {
      await accountService.remove(selectedAccount.id_account);
      toast.success(`Account "${selectedAccount.username}" deleted successfully`);
      fetchData();
    } catch {
      toast.error('Failed to delete account');
    } finally {
      setIsAccountDeleteDialogOpen(false);
      setSelectedAccount(null);
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accountData = {
      username: accountFormData.username,
      password: accountFormData.password,
    };
    try {
      if (editingAccount) {
        await accountService.update(editingAccount.id_account, accountData);
        toast.success(`Account "${accountFormData.username}" updated successfully`);
      } else {
        await accountService.create(accountData);
        toast.success(`Account "${accountFormData.username}" created successfully`);
      }
      setIsAccountDialogOpen(false);
      fetchData();
      resetAccountForm();
    } catch {
      toast.error('Failed to save account');
    }
  };

  const handleAccountEdit = (account: Account) => {
    setEditingAccount(account);
    setAccountFormData({
      username: account.username,
      password: '', // Don't populate password for security reasons
    });
    setIsAccountDialogOpen(true);
  };

  const resetAccountForm = () => {
    setAccountFormData({
      username: '',
      password: '',
    });
    setEditingAccount(null);
  };

  const filteredAccounts = accounts.filter(account => {
    return account.username.toLowerCase().includes(accountSearchTerm.toLowerCase());
  });

  const getUsersForAccount = (accountId: number) => {
    const linkedUsers = users.filter(user => user.id_account === accountId);
    return linkedUsers.map(user => `${user.firstname} ${user.lastname}`).join(', ') || 'None';
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <UsersIcon className="h-6 w-6 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground">Manage users and their accounts</p>
        </div>
      </div>

      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Key className="h-4 w-4" /> Accounts
          </TabsTrigger>
        </TabsList>
        
        {/* Users Tab Content */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                className="pl-10 w-full md:w-[300px]" 
                value={userSearchTerm} 
                onChange={e => setUserSearchTerm(e.target.value)} 
              />
            </div>
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetUserForm}><Plus className="mr-2 h-4 w-4" /> Add User</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
                  <DialogDescription>
                    {editingUser ? 'Update the user details' : 'Fill in the details to create a new user'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstname">First Name</label>
                      <Input 
                        id="firstname" 
                        value={userFormData.firstname} 
                        onChange={e => setUserFormData({ ...userFormData, firstname: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastname">Last Name</label>
                      <Input 
                        id="lastname" 
                        value={userFormData.lastname} 
                        onChange={e => setUserFormData({ ...userFormData, lastname: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email">Email</label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={userFormData.email} 
                        onChange={e => setUserFormData({ ...userFormData, email: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone">Phone</label>
                      <Input 
                        id="phone" 
                        value={userFormData.phone} 
                        onChange={e => setUserFormData({ ...userFormData, phone: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="role">Role</label>
                      <Select
                        value={userFormData.role}
                        onValueChange={(value) => setUserFormData({ ...userFormData, role: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Administrator">Administrator</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="Responsible">Responsible</SelectItem>
                          <SelectItem value="Pedagogic">Pedagogic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="id_account">Account</label>
                      <div className="space-y-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search accounts..."
                            className="pl-10"
                            value={accountSearchQuery}
                            onChange={(e) => setAccountSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="max-h-40 overflow-y-auto border rounded-md">
                          {filteredAccountOptions.length > 0 ? (
                            filteredAccountOptions.map(account => (
                              <div
                                key={account.id_account}
                                className={`p-2 cursor-pointer hover:bg-muted flex items-center justify-between ${
                                  userFormData.id_account === account.id_account.toString() ? 'bg-primary/10' : ''
                                }`}
                                onClick={() => setUserFormData({ ...userFormData, id_account: account.id_account.toString() })}
                              >
                                <div className="flex items-center gap-2">
                                  <Key className="h-4 w-4 text-muted-foreground" />
                                  <span>{account.username}</span>
                                </div>
                                {userFormData.id_account === account.id_account.toString() && (
                                  <CheckCircle2 className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-center text-muted-foreground">No accounts found</div>
                          )}
                        </div>
                      </div>
                      {userFormData.id_account && (
                        <div className="text-sm text-muted-foreground">
                          Selected account: {accounts.find(a => a.id_account.toString() === userFormData.id_account)?.username || ''}
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingUser ? 'Update' : 'Create'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? filteredUsers.map(user => (
                        <TableRow key={user.id_user}>
                          <TableCell className="font-medium">{user.id_user}</TableCell>
                          <TableCell>
                            <div className="font-medium">{user.firstname} {user.lastname}</div>
                          </TableCell>
                          <TableCell className="flex items-center gap-1">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {user.email}
                          </TableCell>
                          <TableCell className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {user.phone}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              user.role === 'admin' ? 'destructive' : 
                              user.role === 'teacher' ? 'default' :
                              user.role === 'student' ? 'secondary' : 'outline'
                            }>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex items-center gap-1">
                            <Key className="h-4 w-4 text-muted-foreground" />
                            {getAccountUsername(user.id_account)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleUserEdit(user)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserDeleteClick(user)} className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No users found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Accounts Tab Content */}
        <TabsContent value="accounts" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search accounts..." 
                className="pl-10 w-full md:w-[300px]" 
                value={accountSearchTerm} 
                onChange={e => setAccountSearchTerm(e.target.value)} 
              />
            </div>
            <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetAccountForm}><Plus className="mr-2 h-4 w-4" /> Add Account</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingAccount ? 'Edit Account' : 'Create New Account'}</DialogTitle>
                  <DialogDescription>
                    {editingAccount ? 'Update the account details' : 'Fill in the details to create a new account'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAccountSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="username">Username</label>
                      <Input 
                        id="username" 
                        value={accountFormData.username} 
                        onChange={e => setAccountFormData({ ...accountFormData, username: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password">
                        Password {editingAccount && "(leave blank to keep current password)"}
                      </label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={accountFormData.password} 
                        onChange={e => setAccountFormData({ ...accountFormData, password: e.target.value })} 
                        required={!editingAccount} 
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAccountDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingAccount ? 'Update' : 'Create'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAccounts.length > 0 ? filteredAccounts.map(account => (
                        <TableRow key={account.id_account}>
                          <TableCell className="font-medium">{account.id_account}</TableCell>
                          <TableCell>
                            <div className="font-medium">{account.username}</div>
                          </TableCell>
                          <TableCell>
                            {getUsersForAccount(account.id_account)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleAccountEdit(account)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAccountDeleteClick(account)} className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            No accounts found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isUserDeleteDialogOpen} onOpenChange={setIsUserDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user "{selectedUser?.firstname} {selectedUser?.lastname}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUserDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isAccountDeleteDialogOpen} onOpenChange={setIsAccountDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the account "{selectedAccount?.username}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccountDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Export with the correct name
export default UsersPage;








