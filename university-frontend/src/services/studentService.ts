
import api from './api';
import { Student } from '../types/Student';

export const getStudents = async (page = 1, pageSize = 10) => {
  const response = await api.get(`/students?page=${page}&pageSize=${pageSize}`);
  return response.data;
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

export const createStudent = async (student: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  departmentId: string | number;
}): Promise<Student> => {
  const payload = {
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    password: student.password,
    phoneNumber: student.phoneNumber,
    department: { departmentId: Number(student.departmentId) }
  };
  const response = await api.post('/students', payload);
  return response.data as Student;
};

export const getStudentCount = async (): Promise<number> => {
  const response = await api.get('/students/count');
  return response.data as number;
};