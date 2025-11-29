import axios from 'axios';

export interface Department {
  departmentId: number;
  departmentName: string;
}

export const getDepartmentById = async (departmentId: number): Promise<Department> => {
  const response = await axios.get(`/departments/${departmentId}`);
  return response.data as Department;
};
