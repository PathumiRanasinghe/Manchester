import axios from 'axios';

export interface Module {
  moduleId: number;
  moduleName: string;
  credits: number;
  lecturerId: number;
  departmentId: number;
  description?: string;
}

export const getModulesByStudentId = async (studentId: number): Promise<Module[]> => {
  const response = await axios.get(`/modules/student/${studentId}`);
  return response.data as Module[];
};

export const getModulesByDepartmentId = async (departmentId: number): Promise<Module[]> => {
  const response = await axios.get(`/modules/department/${departmentId}`);
  return response.data as Module[];
};
