import api from './api';

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
