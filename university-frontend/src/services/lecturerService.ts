import api from './api';
import { Student } from '../types/Student';
import { Module } from '../types/Module';
import { Lecturer } from '../types/Lecturer';

export const getLecturers = async (): Promise<Lecturer[]> => {
  const response = await api.get('/lecturers');
  return response.data as Lecturer[];
};

export const getLecturerById = async (lecturerId: number): Promise<Lecturer> => {
  const response = await api.get(`/lecturers/${lecturerId}`);
  return response.data as Lecturer;
};


export const getStudentsByModuleId = async (moduleId: number): Promise<Student[]> => {
  const response = await api.get(`/modules/${moduleId}/students`);
  return response.data as Student[];
};

export const getModulesByLecturerId = async (lecturerId: number): Promise<Module[]> => {
  const response = await api.get(`/modules/lecturer/${lecturerId}`);
  return response.data as Module[];
};