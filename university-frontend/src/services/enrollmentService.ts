import api from './api';
import { Enrollment } from '../types/Enrollment';

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
  return (response.data as Enrollment[]).filter(e => e.module.moduleId === moduleId);
}
