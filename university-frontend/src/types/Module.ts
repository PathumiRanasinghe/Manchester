import { Lecturer } from './Lecturer';
import { Department } from './Department';

export interface Module {
  moduleId: number;
  moduleName: string;
  credits: number;
  lecturer: Lecturer;
  department: Department;
  description?: string;
}