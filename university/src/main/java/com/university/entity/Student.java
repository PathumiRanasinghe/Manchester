package com.university.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;


import jakarta.persistence.*;

@Entity
@Table(name = "Student")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StudentID")
    private Integer studentId;

    @Column(name = "FirstName", length = 10)
    private String firstName;

    @Column(name = "LastName", length = 10)
    private String lastName;

    @Column(name = "Email", length = 25, unique = true)
    private String email;

    @Column(name = "PhoneNumber", length = 10)
    private String phoneNumber;

    @Column(name = "DepartmentID")
    private Integer departmentId;

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Integer getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Integer departmentId) {
        this.departmentId = departmentId;
    }
}
