package com.university.dto;

import java.time.LocalDateTime;


public class EnrollmentDto {

    private Long enrollmentId;
    private StudentDto student;
    private ModuleDto module;
    private LocalDateTime enrollmentDate;
    
    public EnrollmentDto(Long enrollmentId, StudentDto student, ModuleDto module, LocalDateTime enrollmentDate) {
        this.enrollmentId = enrollmentId;
        this.student = student;
        this.module = module;
        this.enrollmentDate = enrollmentDate;
    }

    public EnrollmentDto() {
    }

    public Long getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(Long enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public StudentDto getStudent() {
        return student;
    }

    public void setStudent(StudentDto student) {
        this.student = student;
    }

    public ModuleDto getModule() {
        return module;
    }

    public void setModule(ModuleDto module) {
        this.module = module;
    }

    public java.time.LocalDateTime getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(java.time.LocalDateTime enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }


  
}
    

   
