import { Module } from "./Module";
import { Student } from "./Student";

export interface Enrollment {
  enrollmentId: number;
  student: Student;
  module: Module
  enrollmentDate: Date;
}
