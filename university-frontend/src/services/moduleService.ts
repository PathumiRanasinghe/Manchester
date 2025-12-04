import api from './api';
import { Module } from '../types/Module';

export const getModulesByStudentId = async (studentId: number): Promise<Module[]> => {
  const response = await api.get(`/modules/student/${studentId}`);
  return response.data as Module[];
};

export const getModulesByDepartmentId = async (departmentId: number): Promise<Module[]> => {
  const response = await api.get(`/modules/department/${departmentId}`);
  return response.data as Module[];
};

export const getModuleById = async (moduleId: number): Promise<Module> => {
  const response = await api.get(`/modules/${moduleId}`);
  return response.data as Module;
};

export const createModule = async (moduleData: Partial<Module>): Promise<Module> => {
  const response = await api.post('/modules', moduleData);
  return response.data as Module;
};

export const getModules = async (): Promise<Module[]> => {
  const response = await api.get('/modules');
  return response.data as Module[];
};