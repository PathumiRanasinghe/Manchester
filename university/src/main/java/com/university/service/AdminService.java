 
package com.university.service;

import java.util.List;
import com.university.entity.Admin;
import com.university.entity.Lecturer;
import com.university.entity.Student;
import com.university.repository.AdminRepository;
import com.university.repository.StudentRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AdminService {
    @Transactional
    public boolean deleteStudent(Long id) {
        Student student = studentRepository.findById(id);
        if (student != null) {
            studentRepository.delete(student);
            return true;
        }
        return false;
    }

    public Admin getAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }
    @Inject
    StudentRepository studentRepository;

    @Inject
    LecturerService lecturerService;

    @Inject
    AdminRepository adminRepository;

    public List<Student> getAllStudents(){
        return studentRepository.listAll();
    }

    public List<Lecturer> getAllLecturers(){
        return lecturerService.getAllLecturers();
    }

    public List<Admin> getAllAdmin(){
        return adminRepository.listAll();
    }

    public Admin getAdminById(Long id){
        return adminRepository.findById(id);
    }

    @Transactional
    public Admin createAdmin(Admin admin){
        adminRepository.persist(admin);
        return admin;
    }


    @Inject
    KeycloakAdminClient keycloakAdminClient;

    @Inject
    DepartmentService departmentService;

    @Transactional
    public Student createStudent(Student student) {
        try {
            // Use student's email as username for Keycloak registration
            String token = keycloakAdminClient.getAdminToken();
            keycloakAdminClient.createUserAndAssignRole(token, student.getEmail(), student.getEmail(), student.getPassword(), "student");
        } catch (Exception e) {
            throw new RuntimeException("Keycloak user creation failed: " + e.getMessage());
        }
        // Set department if departmentId is provided (from frontend)
        if (student.getDepartment() == null && student.getPassword() != null) {
            // Try to get departmentId from a transient field (not mapped, so use reflection or DTO in real app)
            // For now, assume frontend sends departmentId as part of JSON and it's mapped to student.department.departmentId
        }
       
        // Defensive: if department is not set, try to fetch by departmentId if present
        if (student.getDepartment() == null) {
            throw new RuntimeException("Department must be set on student");
        }
        studentRepository.persist(student);
        return student;
    }
}
