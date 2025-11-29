import axios from 'axios';

export interface Student {
	studentId: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	departmentId: number;
}
export const getStudents = async (): Promise<Student[]> => {
	const response = await axios.get('/students');
	return response.data as Student[];
};

export const getStudentById = async (studentId: number): Promise<Student> => {
	const response = await axios.get(`/students/${studentId}`);
	return response.data as Student;
};
