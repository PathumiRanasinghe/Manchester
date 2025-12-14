package com.university.mapper;

import com.university.dto.StudentDto;
import com.university.entity.Student;

public class StudentMapper {

    public static Student toEntity(StudentDto dto) {
        if (dto == null)
            return null;
        Student student = new Student();
        student.setStudentId(dto.getStudentId());
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setEmail(dto.getEmail());
        student.setPhoneNumber(dto.getPhoneNumber());
        student.setPassword(dto.getPassword());
        if (dto.getDepartment() != null) {
            student.setDepartment(DepartmentMapper.toEntity(dto.getDepartment()));
        }
        return student;
    }

    public static StudentDto toDto(Student student) {
        if (student == null)
            return null;
        return new StudentDto(
            student.getStudentId(),
            student.getFirstName(),
            student.getLastName(),
            student.getEmail(),
            student.getPhoneNumber(),
            DepartmentMapper.toDto(student.getDepartment()),
            null 
        );
    }
}
