import axios from 'axios';

export async function unenrollModule(enrollmentId: number): Promise<void> {
  await axios.delete(`/enrollments/${enrollmentId}`);
}

export async function enrollModule(studentId: number, moduleId: number): Promise<void> {
  await axios.post('/enrollments', {
    studentId,
    moduleId,
    enrollmentDate: new Date().toISOString()
  });
}
