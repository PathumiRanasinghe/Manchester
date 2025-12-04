import api from './api';
import { Department } from '../types/Department';

export const getDepartmentById = async (departmentId: number): Promise<Department> => {
  const response = await api.get(`/departments/${departmentId}`);
  return response.data as Department;
};

export const createDepartment = async (departmentData: Partial<Department>): Promise<Department> => {
  const response = await api.post('/departments', departmentData);
  return response.data as Department;
};

export const getDepartments = async (): Promise<Department[]> => {
  const response = await api.get('/departments');
  return response.data as Department[];
};

export const updateDepartment = async (departmentId: number, departmentData: Partial<Department>): Promise<Department> => {
  const response = await api.put(`/departments/${departmentId}`, departmentData);
  return response.data as Department;
};

export const deleteDepartment = async (departmentId: number): Promise<void> => {
  await api.delete(`/departments/${departmentId}`);
};