package com.university.service;

import java.util.List;
import com.university.entity.Student;

public interface StudentService {
    public List<Student> getAllStudents();

    public Student getStudentById(Long id);

    public Student getStudentByEmail(String email);

    public Student createStudent(Student student);

    public boolean deleteStudent(Long id);

    public List<Student> getStudentsByModuleId(Integer moduleId);

    public List<com.university.entity.Module> getModulesByStudentId(Long studentId);
}
