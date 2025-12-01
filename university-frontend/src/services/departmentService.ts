import axios from 'axios';
import { Department } from '../types/Department';

export const getDepartmentById = async (departmentId: number): Promise<Department> => {
  const response = await axios.get(`/departments/${departmentId}`);
  return response.data as Department;
};
