
package com.university.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Enrollment")
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer enrollmentId;

    @ManyToOne
    @JoinColumn(name = "studentId", referencedColumnName = "studentId")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "moduleId", referencedColumnName = "moduleId")
    private Module module;

    private LocalDateTime enrollmentDate;

    public Integer getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(Integer enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public LocalDateTime getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDateTime enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }
}