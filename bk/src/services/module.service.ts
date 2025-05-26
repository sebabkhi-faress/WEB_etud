
import { supabase } from '@/lib/supabase';
import { Module } from '@/types/database.types';
import { getAll, getById, create, update, remove } from './base.service';

export const moduleService = {
  getAll: () => getAll<Module>('module'),
  getById: (id: number) => getById<Module>('module', 'id_module', id),
  create: (module: Partial<Module>) => create<Module>('module', module),
  update: (id: number, module: Partial<Module>) => update<Module>('module', 'id_module', id, module),
  remove: (id: number) => remove('module', 'id_module', id),
  getByUnit: async (unitId: number): Promise<Module[]> => {
    const { data, error } = await supabase
      .from('module')
      .select('*')
      .eq('idunit', unitId);
      
    if (error) {
      console.error(`Error fetching modules for unit ${unitId}:`, error);
      throw error;
    }
    
    return data as Module[];
  }
};
