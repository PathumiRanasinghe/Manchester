import axios from 'axios';
import { Enrollment } from '../types/Enrollment';
import { Student } from '../types/Student';

export const getStudents = async (): Promise<Student[]> => {
	const response = await axios.get('/api/students');
	return response.data as Student[];
};

export const getStudentById = async (studentId: number): Promise<Student> => {
	const response = await axios.get(`/api/students/${studentId}`);
	return response.data as Student;
};

export async function getEnrollmentsByStudentId(studentId: number): Promise<Enrollment[]> {
  const response = await axios.get(`/api/enrollments`);
  return (response.data as Enrollment[]).filter(e => e.student.studentId === studentId);
}
