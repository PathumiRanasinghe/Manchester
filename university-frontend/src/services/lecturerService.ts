import axios from 'axios';
import { Student } from '../types/Student';
import { Module } from '../types/Module';
import { Lecturer } from '../types/Lecturer';

export const getLecturers = async (): Promise<Lecturer[]> => {
  const response = await axios.get('/lecturers');
  return response.data as Lecturer[];
};

export const getLecturerById = async (lecturerId: number): Promise<Lecturer> => {
  const response = await axios.get(`/lecturers/${lecturerId}`);
  return response.data as Lecturer;
};


export const getStudentsByModuleId = async (moduleId: number): Promise<Student[]> => {
  const response = await axios.get(`/modules/${moduleId}/students`);
  return response.data as Student[];
};

export const getModulesByLecturerId = async (lecturerId: number): Promise<Module[]> => {
  const response = await axios.get(`/modules/lecturer/${lecturerId}`);
  return response.data as Module[];
};