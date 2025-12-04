import axios from 'axios';

export async function unenrollModule(enrollmentId: number): Promise<void> {
  await axios.delete(`/api/enrollments/${enrollmentId}`);
}

export async function enrollModule(studentId: number, moduleId: number): Promise<void> {
  await axios.post('/api/enrollments', {
    student: { studentId },
    module: { moduleId },
    enrollmentDate: new Date().toISOString()
  });
}
