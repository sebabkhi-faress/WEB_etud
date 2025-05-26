import { supabase } from '@/lib/supabase';
import { User, Account } from '@/types/database.types';

// User service
export const userService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('user')  // Changed from 'users' to 'user'
      .select('*')
      .order('id_user', { ascending: true });
    
    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    return data;
  },
  
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('user')  // Changed from 'users' to 'user'
      .select('*')
      .eq('id_user', id)
      .single();
    
    if (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  getByAccountId: async (accountId: number) => {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('id_account', accountId)
      .single();
    
    if (error) {
      console.error(`Error fetching user with account ID ${accountId}:`, error);
      throw error;
    }
    
    if (!data) {
      console.error(`No user found for account ID ${accountId}`);
      return null;
    }
    
    return data;
  },
  
  create: async (user: Partial<User>) => {
    const { data, error } = await supabase
      .from('user')  // Changed from 'users' to 'user'
      .insert([user])
      .select();
    
    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }
    
    return data[0];
  },
  
  update: async (id: number, user: Partial<User>) => {
    const { data, error } = await supabase
      .from('user')  // Changed from 'users' to 'user'
      .update(user)
      .eq('id_user', id)
      .select();
    
    if (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
    
    return data[0];
  },
  
  remove: async (id: number) => {
    const { error } = await supabase
      .from('user')  // Changed from 'users' to 'user'
      .delete()
      .eq('id_user', id);
    
    if (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
    
    return true;
  }
};

// Account service
export const accountService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('account')  // Changed from 'accounts' to 'account'
      .select('*')
      .order('id_account', { ascending: true });
    
    if (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
    
    return data;
  },
  
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('account')  // Changed from 'accounts' to 'account'
      .select('*')
      .eq('id_account', id)
      .single();
    
    if (error) {
      console.error(`Error fetching account with ID ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  create: async (account: Partial<Account>) => {
    const { data, error } = await supabase
      .from('account')  // Changed from 'accounts' to 'account'
      .insert([account])
      .select();
    
    if (error) {
      console.error('Error creating account:', error);
      throw error;
    }
    
    return data[0];
  },
  
  update: async (id: number, account: Partial<Account>) => {
    const { data, error } = await supabase
      .from('account')  // Changed from 'accounts' to 'account'
      .update(account)
      .eq('id_account', id)
      .select();
    
    if (error) {
      console.error(`Error updating account with ID ${id}:`, error);
      throw error;
    }
    
    return data[0];
  },
  
  remove: async (id: number) => {
    const { error } = await supabase
      .from('account')  // Changed from 'accounts' to 'account'
      .delete()
      .eq('id_account', id);
    
    if (error) {
      console.error(`Error deleting account with ID ${id}:`, error);
      throw error;
    }
    
    return true;
  },
  
  authenticate: async (username: string, password: string) => {
    const { data, error } = await supabase
      .from('account')
      .select('*')
      .eq('username', username)
      .eq('password', password)  // Note: In a real app, you should never compare passwords directly like this
      .single();
    
    if (error) {
      console.error('Authentication error:', error);
      return null;
    }
    
    return data;
  }
};



