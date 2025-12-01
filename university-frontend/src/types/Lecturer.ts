import { Department } from './Department';

export interface Lecturer {
  lecturerId: number;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
}