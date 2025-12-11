import api from './api';
import { Lecturer } from '../types/Lecturer';

export const getLecturers = async (): Promise<Lecturer[]> => {
  const response = await api.get('/lecturers');
  return response.data as Lecturer[];
};

export const getLecturerById = async (lecturerId: number): Promise<Lecturer> => {
  const response = await api.get(`/lecturers/${lecturerId}`);
  return response.data as Lecturer;
};

export const getLecturerByEmail = async (email: string): Promise<Lecturer> => {
  const response = await api.get(`/lecturers/by-email?email=${encodeURIComponent(email)}`);
  return response.data as Lecturer;
};

export const getLecturersByDepartmentId = async (departmentId: number): Promise<Lecturer[]> => {
  const response = await api.get(`/departments/${departmentId}/lecturers`);
  return response.data as Lecturer[];
};

export const deleteLecturer = async (lecturerId: number): Promise<void> => {
  await api.delete(`/lecturers/${lecturerId}`);
};

export async function createLecturer({ firstName, lastName, email, password, departmentId }: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  departmentId: number;
}): Promise<Lecturer> {
  const payload = {
    firstName,
    lastName,
    email,
    password,
    department: { departmentId }
  };
  const response = await api.post("/lecturers", payload);
  return response.data as Lecturer;
}