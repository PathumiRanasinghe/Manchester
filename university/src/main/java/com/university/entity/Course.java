package com.university.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Course extends PanacheEntity {

    private String courseName;
    private String description;

    @OneToMany(mappedBy = "course")
    private List<Subject> subjects;

    @OneToMany(mappedBy = "course")
    private List<Student> students;

    @OneToMany(mappedBy = "course")
    private List<Lecturer> lecturers;

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Subject> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<Subject> subjects) {
        this.subjects = subjects;
    }

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }

    public List<Lecturer> getLecturers() {
        return lecturers;
    }

    public void setLecturers(List<Lecturer> lecturers) {
        this.lecturers = lecturers;
    }
}
