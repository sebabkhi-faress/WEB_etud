export type CategoryType = 'Domain' | 'Sector' | 'Specialty';
export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type Period = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
export type RequestStatus = 'Pending' | 'Accepted' | 'Rejected';
export type SessionType = 'Lecture' | 'Class' | 'Lab';
export type SpaceType = 'Regular Classroom' | 'Lecture Hall' | 'Computer Lab';

export interface Account {
  id_account: number;
  username: string;
  password: string;
}

export interface User {
  id_user: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  id_account: number; // Foreign Key to Account
}

export interface Formation {
  idformation: number; // Primary Key
  name: string;
  durationyears?: number;
  created_at?: string;
}

export interface Level {
  idlevel: number; // Primary Key
  name: string;
  idformation: number; // Foreign Key to Formation
  created_at?: string;
}

export interface Category {
  idcategory: number; // Primary Key
  name: string;
  idlevel: number; // Foreign Key to Level
  CategoryType?: CategoryType;
  created_at?: string;
}

export interface Semester {
  idsemester: number; // Primary Key
  name: string;
  startdate: string;
  enddate: string;
  idspecialty: number; // Foreign Key to Category (renamed from idcategory)
  created_at?: string;
}

export interface Section {
  idsection: number; // Primary Key
  name: string;
  capacity: number;
  idSemester: number; // Foreign Key to Semester (note camelCase)
  created_at?: string;
}

export interface Unit {
  idunit: number; // Primary Key
  name: string;
  idsemester: number; // Foreign Key to Semester
  created_at?: string;
}

export interface Module {
  id_module: number; // Primary Key
  name: string;
  coefficient?: number;
  credits?: number;
  volumehours?: number;
  weeklycm?: string;
  weeklytd?: string;
  weeklytp?: string;
  idunit: number; // Foreign Key to Unit
  moduletype?: string;
  created_at?: string;
}

export interface Group {
  idgroup: number; // Primary Key
  name: string;
  membercount: number;
  idsection: number; // Foreign Key to Section
  created_at?: string;
}

export interface EducationalSpace {
  id: number; // Primary Key
  space_code: string;
  space_type: SpaceType;
  building_code: string;
  capacity: number;
  has_projector: boolean;
  has_computers: boolean;
  created_at?: string;
}

export interface Class {
  id_class: number; // Primary Key
  id_user: number; // Foreign Key to User
  id_module: number; // Foreign Key to Module
  year_taught: string;
  SessionType: SessionType;
  isVisible: boolean;
  id_section: number; // Foreign Key to Section
  created_at?: string;
}

export interface Session {
  id_session: number; // Primary Key
  id_user: number; // Foreign Key to User
  id_module: number; // Foreign Key to Module
  year_taught: string;
  SessionType: SessionType;
  isVisible: boolean;
  id_group: number; // Foreign Key to Group
  created_at?: string;
}

export interface Timetable {
  id: number; // Primary Key
  session_id: number; // Foreign Key to Session
  class_id: number; // Foreign Key to Class
  space_id: number; // Foreign Key to EducationalSpace
  day: Day;
  period: Period;
  created_at?: string;
}

export interface TeacherAssignmentRequest {
  request_id: number; // Primary Key
  id_user: number; // Foreign Key to User
  id_module: number; // Foreign Key to Module
  session_type: SessionType;
  status: RequestStatus;  
  request_date: string;
  StudyingDay: Day;
  created_at?: string;
}