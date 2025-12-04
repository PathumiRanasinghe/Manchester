import axios from 'axios';
import { Department } from '../types/Department';

export const getDepartmentById = async (departmentId: number): Promise<Department> => {
  const response = await axios.get(`/api/departments/${departmentId}`);
  return response.data as Department;
};

export const createDepartment = async (departmentData: Partial<Department>): Promise<Department> => {
  const response = await axios.post('/api/departments', departmentData);
  return response.data as Department;
};

export const getDepartments = async (): Promise<Department[]> => {
  const response = await axios.get('/api/departments');
  return response.data as Department[];
};