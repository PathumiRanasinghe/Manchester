import axios from 'axios';
import { Enrollment } from '../types/Enrollment';

export async function getEnrollmentsByStudentId(studentId: number): Promise<Enrollment[]> {
  const response = await axios.get(`/enrollments`);
  return (response.data as Enrollment[]).filter(e => e.studentId === studentId);
}
