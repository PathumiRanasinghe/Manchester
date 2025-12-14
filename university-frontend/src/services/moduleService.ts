import api from './api';
import { Module } from '../types/Module';

export const getModulesByStudentId = async (studentId: number): Promise<Module[]> => {
  const response = await api.get(`/students/${studentId}/modules`);
  return response.data as Module[];
};

export const getModulesByDepartmentId = async (departmentId: number): Promise<Module[]> => {
  const response = await api.get(`/departments/${departmentId}/modules`);
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

export interface PaginatedModules {
  items: Module[];
  total: number;
  page: number;
  pageSize: number;
}

export const getModules = async (page = 1, pageSize = 10): Promise<PaginatedModules> => {
  const response = await api.get(`/modules?page=${page}&pageSize=${pageSize}`);
  return response.data as PaginatedModules;
};

export const updateModule = async (
  moduleId: number,
  moduleData: Partial<Module> & { lecturerId?: number }
): Promise<Module> => {
  const response = await api.put(`/modules/${moduleId}`, moduleData);
  return response.data as Module;
};

export const deleteModule = async (moduleId: number): Promise<void> => {
  await api.delete(`/modules/${moduleId}`);
};

export const getModulesByLecturerId = async (lecturerId: number): Promise<Module[]> => {
  const response = await api.get(`/lecturers/${lecturerId}/modules`);
  return response.data as Module[];
};
export const getModuleCount = async (): Promise<number> => {
  const response = await api.get('/modules/count');
  return response.data as number;
};