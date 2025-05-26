// src/services/supabase.service.ts
import { createClient } from "@supabase/supabase-js";
import {
  Account,
  Category,
  Class,
  EducationalSpace,
  Formation,
  Group,
  Level,
  Module,
  Section,
  Semester,
  Session,
  TeacherAssignmentRequest,
  Timetable,
  Unit,
  User,
} from '@/types/database.types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Generic service class for common CRUD operations
class BaseService<T> {
  constructor(private tableName: string) {}

  async getAll() {
    return await supabase.from(this.tableName).select('*');
  }

  async getById(id: number) {
    return await supabase.from(this.tableName).select('*').eq('id', id).single();
  }

  async create(data: Partial<T>) {
    return await supabase.from(this.tableName).insert(data).select().single();
  }

  async update(id: number, data: Partial<T>) {
    return await supabase.from(this.tableName).update(data).eq('id', id).select().single();
  }

  async delete(id: number) {
    return await supabase.from(this.tableName).delete().eq('id', id);
  }
}

// Teacher Assignment Request Service
export const teacherAssignmentRequestService = {
  async getAll() {
    return await supabase.from('teacher_assignment_request').select('*');
  },

  async getById(id: number) {
    return await supabase.from('teacher_assignment_request').select('*').eq('request_id', id).single();
  },

  async create(data: Partial<TeacherAssignmentRequest>) {
    return await supabase.from('teacher_assignment_request').insert(data).select().single();
  },

  async update(id: number, data: Partial<TeacherAssignmentRequest>) {
    return await supabase.from('teacher_assignment_request').update(data).eq('request_id', id).select().single();
  },

  async delete(id: number) {
    return await supabase.from('teacher_assignment_request').delete().eq('request_id', id);
  }
};

// Account Service
export const accountService = new BaseService<Account>('account');

// Category Service
export const categoryService = new BaseService<Category>('category');

// Class Service
export const classService = new BaseService<Class>('class');

// Educational Space Service
export const educationalSpaceService = new BaseService<EducationalSpace>('educational_spaces');

// Formation Service
export const formationService = new BaseService<Formation>('formation');

// Group Service
export const groupService = new BaseService<Group>('groups');

// Level Service
export const levelService = new BaseService<Level>('level');

// Module Service
export const moduleService = new BaseService<Module>('module');

// Section Service
export const sectionService = new BaseService<Section>('section');

// Semester Service
export const semesterService = new BaseService<Semester>('semester');

// Session Service
export const sessionService = new BaseService<Session>('session');

// Timetable Service
export const timetableService = new BaseService<Timetable>('timetable');

// Unit Service
export const unitService = new BaseService<Unit>('unit');

// User Service
export const userService = new BaseService<User>('user');

// Additional specialized queries can be added here
export const specializedQueries = {
  // Get all modules for a specific unit
  async getModulesByUnit(unitId: number) {
    return await supabase.from('module').select('*').eq('idunit', unitId);
  },

  // Get all classes for a specific teacher
  async getClassesByTeacher(teacherId: number) {
    return await supabase.from('class').select('*').eq('id_user', teacherId);
  },

  // Get all sessions for a specific group
  async getSessionsByGroup(groupId: number) {
    return await supabase.from('session').select('*').eq('id_group', groupId);
  },

  // Get timetable for a specific space
  async getTimetableBySpace(spaceId: number) {
    return await supabase.from('timetable').select('*').eq('space_id', spaceId);
  },

  // Get all users with a specific role
  async getUsersByRole(role: string) {
    return await supabase.from('user').select('*').eq('role', role);
  },

  // Get all categories for a specific level
  async getCategoriesByLevel(levelId: number) {
    return await supabase.from('category').select('*').eq('idlevel', levelId);
  },

  // Get all sections for a specific semester
  async getSectionsBySemester(semesterId: number) {
    return await supabase.from('section').select('*').eq('id_semester', semesterId);
  },

  // Get all units for a specific semester
  async getUnitsBySemester(semesterId: number) {
    return await supabase.from('unit').select('*').eq('idsemester', semesterId);
  },

  // Get all groups for a specific section
  async getGroupsBySection(sectionId: number) {
    return await supabase.from('groups').select('*').eq('idsection', sectionId);
  },

  // Get all levels for a specific formation
  async getLevelsByFormation(formationId: number) {
    return await supabase.from('level').select('*').eq('idformation', formationId);
  }
};