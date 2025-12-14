package com.university.service;

import java.util.List;
import com.university.entity.Student;
import com.university.dto.PaginatedResponse;
import com.university.dto.StudentDto;

public interface StudentService {
    PaginatedResponse<StudentDto> getAllStudents(Integer page, Integer pageSize);

    public Student getStudentById(Long id);

    public Student getStudentByEmail(String email);

    public Student createStudent(Student student);

    public boolean deleteStudent(Long id);

    public List<Student> getStudentsByModuleId(Integer moduleId);

    public List<com.university.entity.Module> getModulesByStudentId(Long studentId);
}
