
import { supabase } from '@/lib/supabase';
import { Unit, Semester, Section, Group } from '@/types/database.types';
import { getAll, getById, create, update, remove } from './base.service';

export const semesterService = {
  getAll: () => getAll<Semester>('semester'),
  getById: (id: number) => getById<Semester>('semester', 'idsemester', id),
  create: (semester: Partial<Semester>) => create<Semester>('semester', semester),
  update: (id: number, semester: Partial<Semester>) => update<Semester>('semester', 'idsemester', id, semester),
  remove: (id: number) => remove('semester', 'idsemester', id),
  getByCategory: async (categoryId: number): Promise<Semester[]> => {
    const { data, error } = await supabase
      .from('semester')
      .select('*')
      .eq('idspecialty', categoryId);
      
    if (error) {
      console.error(`Error fetching semesters for category ${categoryId}:`, error);
      throw error;
    }
    
    return data as Semester[];
  }
};

export const sectionService = {
  getAll: () => getAll<Section>('section'),
  getById: (id: number) => getById<Section>('section', 'idsection', id),
  create: (section: Partial<Section>) => create<Section>('section', section),
  update: (id: number, section: Partial<Section>) => update<Section>('section', 'idsection', id, section),
  remove: (id: number) => remove('section', 'idsection', id),
  getBySemester: async (semesterId: number): Promise<Section[]> => {
    const { data, error } = await supabase
      .from('section')
      .select('*')
      .eq('idsemester', semesterId);
      
    if (error) {
      console.error(`Error fetching sections for semester ${semesterId}:`, error);
      throw error;
    }
    
    return data as Section[];
  }
};

export const unitService = {
  getAll: () => getAll<Unit>('unit'),
  getById: (id: number) => getById<Unit>('unit', 'idunit', id),
  create: (unit: Partial<Unit>) => create<Unit>('unit', unit),
  update: (id: number, unit: Partial<Unit>) => update<Unit>('unit', 'idunit', id, unit),
  remove: (id: number) => remove('unit', 'idunit', id),
  getBySemester: async (semesterId: number): Promise<Unit[]> => {
    const { data, error } = await supabase
      .from('unit')
      .select('*')
      .eq('idsemester', semesterId);
      
    if (error) {
      console.error(`Error fetching units for semester ${semesterId}:`, error);
      throw error;
    }
    
    return data as Unit[];
  }
};

export const groupService = {
  getAll: () => getAll<Group>('group'),
  getById: (id: number) => getById<Group>('group', 'idgroup', id),
  create: (group: Partial<Group>) => create<Group>('group', group),
  update: (id: number, group: Partial<Group>) => update<Group>('group', 'idgroup', id, group),
  remove: (id: number) => remove('group', 'idgroup', id),
  getBySection: async (sectionId: number): Promise<Group[]> => {
    const { data, error } = await supabase
      .from('group')
      .select('*')
      .eq('idsection', sectionId);
      
    if (error) {
      console.error(`Error fetching groups for section ${sectionId}:`, error);
      throw error;
    }
    
    return data as Group[];
  }
};
