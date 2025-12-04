import axios from 'axios';

import { Module } from '../types/Module';

export const getModulesByStudentId = async (studentId: number): Promise<Module[]> => {
  const response = await axios.get(`/api/modules/student/${studentId}`);
  return response.data as Module[];
};

export const getModulesByDepartmentId = async (departmentId: number): Promise<Module[]> => {
  const response = await axios.get(`/api/modules/department/${departmentId}`);
  return response.data as Module[];
};

export const getModuleById = async (moduleId: number): Promise<Module> => {
  const response = await axios.get(`/api/modules/${moduleId}`);
  return response.data as Module;
};

export const createModule = async (moduleData: Partial<Module>): Promise<Module> => {
  const response = await axios.post('/api/modules', moduleData);
  return response.data as Module;
};

export const getModules = async (): Promise<Module[]> => {
  const response = await axios.get('/api/modules');
  return response.data as Module[];
};