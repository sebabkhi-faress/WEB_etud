
import { supabase } from '@/lib/supabase';

// Generic CRUD operations
export const getAll = async <T>(table: string): Promise<T[]> => {
  const { data, error } = await supabase.from(table).select('*');
  
  if (error) {
    console.error(`Error fetching ${table}:`, error);
    throw error;
  }
  
  return data as T[];
};

export const getById = async <T>(table: string, idField: string, id: number): Promise<T | null> => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(idField, id)
    .single();
    
  if (error) {
    console.error(`Error fetching ${table} with id ${id}:`, error);
    throw error;
  }
  
  return data as T;
};

export const create = async <T>(table: string, item: Partial<T>): Promise<T> => {
  const { data, error } = await supabase
    .from(table)
    .insert([item])
    .select()
    .single();
    
  if (error) {
    console.error(`Error creating ${table}:`, error);
    throw error;
  }
  
  return data as T;
};

export const update = async <T>(
  table: string, 
  idField: string, 
  id: number, 
  item: Partial<T>
): Promise<T> => {
  const { data, error } = await supabase
    .from(table)
    .update(item)
    .eq(idField, id)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating ${table} with id ${id}:`, error);
    throw error;
  }
  
  return data as T;
};

export const remove = async (table: string, idField: string, id: number): Promise<void> => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq(idField, id);
    
  if (error) {
    console.error(`Error deleting ${table} with id ${id}:`, error);
    throw error;
  }
};
