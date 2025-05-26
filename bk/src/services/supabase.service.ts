import { supabase } from '@/lib/supabase';
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
  Day,
  SessionType,
  RequestStatus
} from '@/types/database.types';

// Account Service
export const accountService = {
  async getAll() {
    return await supabase.from('account').select('*');
  },

  async getById(id: number) {
    return await supabase.from('account').select('*').eq('id_account', id).single();
  },

  async create(data: Partial<Account>) {
    return await supabase.from('account').insert([data]).select();
  },

  async update(id: number, data: Partial<Account>) {
    return await supabase.from('account').update(data).eq('id_account', id).select();
  },

  async delete(id: number) {
    return await supabase.from('account').delete().eq('id_account', id);
  },
  
  async authenticate(username: string, password: string) {
    return await supabase
      .from('account')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();
  }
};

// User Service
export const userService = {
  async getAll() {
    return await supabase.from('user').select('*');
  },

  async getById(id: number) {
    return await supabase.from('user').select('*').eq('id_user', id).single();
  },
  
  async getByAccountId(accountId: number) {
    return await supabase.from('user').select('*').eq('id_account', accountId).single();
  },

  async create(data: Partial<User>) {
    return await supabase.from('user').insert([data]).select();
  },

  async update(id: number, data: Partial<User>) {
    return await supabase.from('user').update(data).eq('id_user', id).select();
  },

  async delete(id: number) {
    return await supabase.from('user').delete().eq('id_user', id);
  }
};

// Semester Service
export const semesterService = {
  async getAll() {
    return await supabase.from('semester').select(`
      *,
      category:idcategory(
        *,
        level:idlevel(
          *,
          formation:idformation(*)
        )
      )
    `);
  },

  async getById(id: number) {
    return await supabase.from('semester').select(`
      *,
      category:idcategory(
        *,
        level:idlevel(
          *,
          formation:idformation(*)
        )
      )
    `).eq('idsemester', id).single();
  },

  async create(data: Partial<Semester>) {
    return await supabase.from('semester').insert([data]).select();
  },

  async update(id: number, data: Partial<Semester>) {
    return await supabase.from('semester').update(data).eq('idsemester', id).select();
  },

  async delete(id: number) {
    return await supabase.from('semester').delete().eq('idsemester', id);
  },
  
  async getSemestersByCategory(categoryId: number) {
    return await supabase.from('semester').select(`
      *,
      category:idcategory(
        *,
        level:idlevel(
          *,
          formation:idformation(*)
        )
      )
    `).eq('idcategory', categoryId);
  }
};

// Unit Service
export const unitService = {
  async getAll() {
    return await supabase.from('unit').select(`
      *,
      semester:idsemester(
        *,
        category:idcategory(
          *,
          level:idlevel(
            *,
            formation:idformation(*)
          )
        )
      )
    `);
  },

  async getById(id: number) {
    return await supabase.from('unit').select(`
      *,
      semester:idsemester(
        *,
        category:idcategory(
          *,
          level:idlevel(
            *,
            formation:idformation(*)
          )
        )
      )
    `).eq('idunit', id).single();
  },

  async create(data: Partial<Unit>) {
    return await supabase.from('unit').insert([data]).select();
  },

  async update(id: number, data: Partial<Unit>) {
    return await supabase.from('unit').update(data).eq('idunit', id).select();
  },

  async delete(id: number) {
    return await supabase.from('unit').delete().eq('idunit', id);
  },
  
  async getUnitsBySemester(semesterId: number) {
    return await supabase.from('unit').select(`
      *,
      semester:idsemester(
        *,
        category:idcategory(
          *,
          level:idlevel(
            *,
            formation:idformation(*)
          )
        )
      )
    `).eq('idsemester', semesterId);
  }
};

// Formation Service
export const formationService = {
  async getAll() {
    return await supabase.from('formation').select('*');
  },

  async getById(id: number) {
    return await supabase.from('formation').select('*').eq('idformation', id).single();
  },

  async create(data: Partial<Formation>) {
    return await supabase.from('formation').insert([data]).select();
  },

  async update(id: number, data: Partial<Formation>) {
    return await supabase.from('formation').update(data).eq('idformation', id).select();
  },

  async delete(id: number) {
    return await supabase.from('formation').delete().eq('idformation', id);
  }
};

// Level Service
export const levelService = {
  async getAll() {
    return await supabase.from('level').select('*');
  },

  async getById(id: number) {
    return await supabase.from('level').select('*').eq('idlevel', id).single();
  },

  async create(data: Partial<Level>) {
    return await supabase.from('level').insert([data]).select();
  },

  async update(id: number, data: Partial<Level>) {
    return await supabase.from('level').update(data).eq('idlevel', id).select();
  },

  async delete(id: number) {
    return await supabase.from('level').delete().eq('idlevel', id);
  },
  
  async getLevelsByFormation(formationId: number) {
    return await supabase.from('level').select('*').eq('idformation', formationId);
  }
};

// Category Service
export const categoryService = {
  async getAll() {
    return await supabase.from('category').select('*');
  },

  async getById(id: number) {
    return await supabase.from('category').select('*').eq('idcategory', id).single();
  },

  async create(data: Partial<Category>) {
    return await supabase.from('category').insert([data]).select();
  },

  async update(id: number, data: Partial<Category>) {
    return await supabase.from('category').update(data).eq('idcategory', id).select();
  },

  async delete(id: number) {
    return await supabase.from('category').delete().eq('idcategory', id);
  },
  
  async getCategoriesByLevel(levelId: number) {
    return await supabase.from('category').select('*').eq('idlevel', levelId);
  }
};

// Module Service
export const moduleService = {
  async getAll() {
    return await supabase.from('module').select('*');
  },

  async getById(id: number) {
    return await supabase.from('module').select('*').eq('id_module', id).single();
  },

  async create(data: Partial<Module>) {
    return await supabase.from('module').insert([data]).select();
  },

  async update(id: number, data: Partial<Module>) {
    return await supabase.from('module').update(data).eq('id_module', id).select();
  },

  async delete(id: number) {
    return await supabase.from('module').delete().eq('id_module', id);
  },
  
  async getModulesByUnit(unitId: number) {
    return await supabase.from('module').select('*').eq('idunit', unitId);
  },
  
  // Get modules with filtering options
  async getModulesWithFilters(filters: {
    formationId?: number;
    levelId?: number;
    categoryId?: number;
    unitId?: number;
  }) {
    let query = supabase.from('module').select(`
      *,
      unit:idunit(
        *,
        semester:idsemester(
          *,
          category:idcategory(
            *,
            level:idlevel(
              *,
              formation:idformation(*)
            )
          )
        )
      )
    `);
    
    // Apply filters if provided
    if (filters.unitId) {
      query = query.eq('idunit', filters.unitId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching filtered modules:', error);
      throw error;
    }
    
    // Further filter results in JS if needed for formation/level/category
    let filteredData = data || [];
    
    if (filters.formationId) {
      filteredData = filteredData.filter(
        module => module.unit?.semester?.category?.level?.formation?.idformation === filters.formationId
      );
    }
    
    if (filters.levelId) {
      filteredData = filteredData.filter(
        module => module.unit?.semester?.category?.level?.idlevel === filters.levelId
      );
    }
    
    if (filters.categoryId) {
      filteredData = filteredData.filter(
        module => module.unit?.semester?.category?.idcategory === filters.categoryId
      );
    }
    
    return { data: filteredData, error: null };
  }
};

// Teacher Assignment Request Service
export const teacherAssignmentRequestService = {
  async getAll() {
    return await supabase.from('TeacherAssignmentRequest').select('*');
  },
  
  async getById(id: number) {
    return await supabase.from('TeacherAssignmentRequest').select('*').eq('request_id', id).single();
  },
  
  async getByTeacher(teacherId: number) {
    return await supabase
      .from('TeacherAssignmentRequest')
      .select('*')
      .eq('id_user', teacherId);
  },
  
  async create(data: Partial<TeacherAssignmentRequest>) {
    const { data: result, error } = await supabase
      .from('TeacherAssignmentRequest')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Error creating teacher assignment request:', error);
      return { data: null, error };
    }

    return { data: result, error: null };
  },
  
  async update(id: number, data: Partial<TeacherAssignmentRequest>) {
    return await supabase
      .from('TeacherAssignmentRequest')
      .update(data)
      .eq('request_id', id)
      .select()
      .single();
  },
  
  async delete(id: number) {
    return await supabase
      .from('TeacherAssignmentRequest')
      .delete()
      .eq('request_id', id);
  },
  
  // Submit multiple preferences at once
  async submitPreferences(preferences: Partial<TeacherAssignmentRequest>[]) {
    return await supabase
      .from('TeacherAssignmentRequest')
      .insert(preferences)
      .select();
  },
  
  // Get teacher preferences with module details
  async getTeacherPreferencesWithDetails(teacherId: number) {
    return await supabase
      .from('TeacherAssignmentRequest')
      .select(`
        *,
        module:id_module(
          *,
          unit:idunit(
            *,
            semester:idsemester(*)
          )
        ),
        user:id_user(*)
      `)
      .eq('id_user', teacherId);
  },

  async isAppealOpen() {
    const { data, error } = await supabase.rpc('is_appeal_open');
    if (error) throw error;
    return data === 'Appeal is currently open.';
  },

  async getRejectedRequests(teacherId: number) {
    return await supabase
      .from('TeacherAssignmentRequest')
      .select(`
        *,
        module:id_module(
          *,
          unit:idunit(
            *,
            semester:idsemester(*)
          )
        ),
        user:id_user(*)
      `)
      .eq('id_user', teacherId)
      .eq('status', 'Rejected');
  }
};

// Section Service
export const sectionService = {
  async getAll() {
    return await supabase.from('section').select(`
      *,
      semester:idsemester(
        *,
        category:idcategory(
          *,
          level:idlevel(
            *,
            formation:idformation(*)
          )
        )
      )
    `);
  },

  async getById(id: number) {
    return await supabase.from('section').select(`
      *,
      semester:idsemester(
        *,
        category:idcategory(
          *,
          level:idlevel(
            *,
            formation:idformation(*)
          )
        )
      )
    `).eq('idsection', id).single();
  },

  async create(data: Partial<Section>) {
    return await supabase.from('section').insert([data]).select();
  },

  async update(id: number, data: Partial<Section>) {
    return await supabase.from('section').update(data).eq('idsection', id).select();
  },

  async delete(id: number) {
    return await supabase.from('section').delete().eq('idsection', id);
  },
  
  async getSectionsBySemester(semesterId: number) {
    return await supabase.from('section').select(`
      *,
      semester:idsemester(
        *,
        category:idcategory(
          *,
          level:idlevel(
            *,
            formation:idformation(*)
          )
        )
      )
    `).eq('idsemester', semesterId);
  }
};

// Group Service
export const groupService = {
  async getAll() {
    return await supabase.from('groups').select(`
      *,
      section:idsection(
        *,
        semester:idsemester(
          *,
          category:idcategory(
            *,
            level:idlevel(
              *,
              formation:idformation(*)
            )
          )
        )
      )
    `);
  },

  async getById(id: number) {
    return await supabase.from('groups').select(`
      *,
      section:idsection(
        *,
        semester:idsemester(
          *,
          category:idcategory(
            *,
            level:idlevel(
              *,
              formation:idformation(*)
            )
          )
        )
      )
    `).eq('idgroup', id).single();
  },

  async create(data: Partial<Group>) {
    return await supabase.from('groups').insert([data]).select();
  },

  async update(id: number, data: Partial<Group>) {
    return await supabase.from('groups').update(data).eq('idgroup', id).select();
  },

  async delete(id: number) {
    return await supabase.from('groups').delete().eq('idgroup', id);
  },
  
  async getGroupsBySection(sectionId: number) {
    return await supabase.from('groups').select(`
      *,
      section:idsection(
        *,
        semester:idsemester(
          *,
          category:idcategory(
            *,
            level:idlevel(
              *,
              formation:idformation(*)
            )
          )
        )
      )
    `).eq('idsection', sectionId);
  }
};

// Fetch the teacher's timetable for the schedule view
export async function getTeacherTimetable(userId) {
  return await supabase
    .from('Timetable')
    .select(`
      *,
      session:session_id(
        *,
        module:id_module(
          *,
          unit:idunit(
            *,
            semester:idsemester(
              *,
              category:idcategory(
                *,
                level:idlevel(
                  *,
                  formation:idformation(*)
                )
              )
            )
          )
        ),
        user:id_user(*),
        group:id_group(*)
      ),
      class:class_id(
        *,
        module:id_module(
          *,
          unit:idunit(
            *,
            semester:idsemester(
              *,
              category:idcategory(
                *,
                level:idlevel(
                  *,
                  formation:idformation(*)
                )
              )
            )
          )
        ),
        user:id_user(*),
        section:id_section(*)
      ),
      space:space_id(*)
    `)
    .or(`session.user.id_user.eq.${userId},class.user.id_user.eq.${userId}`);
}







