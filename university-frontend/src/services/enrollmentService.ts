import api from './api';
import { Enrollment } from '../types/Enrollment';

export async function getPaginatedEnrollments(page: number, pageSize: number) {
  const response = await api.get(`/enrollments?page=${page}&pageSize=${pageSize}`);
  return response.data;
}
export async function unenrollModule(enrollmentId: number): Promise<void> {
  await api.delete(`/enrollments/${enrollmentId}`);
}

export async function enrollModule(studentId: number, moduleId: number): Promise<void> {
  await api.post('/enrollments', {
    student: { studentId },
    module: { moduleId },
    enrollmentDate: new Date().toISOString()
  });
}

export async function getEnrollmentsByModuleId(moduleId: number): Promise<Enrollment[]> {
  const response = await api.get(`/enrollments`);
  return (response.data.items as Enrollment[]).filter(e => e.module.moduleId === moduleId);
}

export async function getEnrollmentsByStudentId(studentId: number): Promise<{ items: Enrollment[] }> {
  const response = await api.get(`/students/${studentId}/enrollments`);
  return response.data;
}


