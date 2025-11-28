
package com.university.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Lecturer")
public class Lecturer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LecturerID")
    private Integer lecturerId;

    @Column(name = "FirstName", length = 10)
    private String firstName;

    @Column(name = "LastName", length = 10)
    private String lastName;

    @Column(name = "Email", length = 25, unique = true)
    private String email;

    @Column(name = "DepartmentID")
    private Integer departmentId;

    public Integer getLecturerId() {
        return lecturerId;
    }

    public void setLecturerId(Integer lecturerId) {
        this.lecturerId = lecturerId;
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

    public Integer getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Integer departmentId) {
        this.departmentId = departmentId;
    }
}
