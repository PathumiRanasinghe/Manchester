import { Student } from './Student';
import { Module } from './Module';

export interface Enrollment {
  enrollmentId: number;
  student: Student;
  module: Module;
  enrollmentDate: Date;
}
