import api from './api';
import { Student } from '../types/Student';

export const getStudents = async (): Promise<Student[]> => {
		const response = await api.get('/students');
		return response.data as Student[];
};

export const getStudentById = async (studentId: number): Promise<Student> => {
		const response = await api.get(`/students/${studentId}`);
		return response.data as Student;
};

export const getStudentByEmail = async (email: string): Promise<Student> => {
    const response = await api.get(`/students/by-email?email=${encodeURIComponent(email)}`);
    return response.data as Student;
};

export const deleteStudent = async (studentId: number): Promise<void> => {
    await api.delete(`/students/${studentId}`);
};

export const getStudentsByModuleId = async (moduleId: number): Promise<Student[]> => {
  const response = await api.get(`/modules/${moduleId}/students`);
  return response.data as Student[];
};
