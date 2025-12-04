
import { Department } from './Department';

export interface Student {
  studentId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: Department;
  password?: string;
}