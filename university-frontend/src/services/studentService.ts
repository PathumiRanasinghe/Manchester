import api from './api';
import { Enrollment } from '../types/Enrollment';
import { Student } from '../types/Student';

export const getStudents = async (): Promise<Student[]> => {
		const response = await api.get('/students');
		return response.data as Student[];
};

export const getStudentById = async (studentId: number): Promise<Student> => {
		const response = await api.get(`/students/${studentId}`);
		return response.data as Student;
};

export async function getEnrollmentsByStudentId(studentId: number): Promise<Enrollment[]> {
	const response = await api.get(`/enrollments`);
	return (response.data as Enrollment[]).filter(e => e.student.studentId === studentId);
}

export const getStudentByEmail = async (email: string): Promise<Student> => {
    const response = await api.get(`/students/by-email?email=${encodeURIComponent(email)}`);
    return response.data as Student;
};

export const deleteStudent = async (studentId: number): Promise<void> => {
    await api.delete(`/admins/students/${studentId}`);
};
