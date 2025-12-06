 
package com.university.service;

import java.util.List;
import com.university.entity.Admin;
import com.university.entity.Lecturer;
import com.university.entity.Student;
import com.university.repository.AdminRepository;
import com.university.repository.LecturerRepository;
import com.university.repository.StudentRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AdminService {

    @Inject
    StudentRepository studentRepository;

    @Inject
    LecturerRepository lecturerRepository;

    @Inject
    AdminRepository adminRepository;

    @Inject
    KeycloakAdminClient keycloakAdminClient;

    @Inject
    DepartmentService departmentService;

    @Transactional
    public boolean deleteStudent(Long id) {
        try{
            String token = keycloakAdminClient.getAdminToken();
            keycloakAdminClient.deleteUserByUsername(token, studentRepository.findById(id).getEmail());
        }
        catch(Exception e){
            throw new RuntimeException("Keycloak user deletion failed: " + e.getMessage());
        }
        Student student = studentRepository.findById(id);
        if (student != null) {
            studentRepository.delete(student);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean deleteLecturer(Long id) {
        try{
            String token = keycloakAdminClient.getAdminToken();
            keycloakAdminClient.deleteUserByUsername(token,lecturerRepository.findById(id).getEmail());
        }
        catch(Exception e){
            throw new RuntimeException("Keycloak user deletion failed: " + e.getMessage());
        }
        Lecturer lecturer = lecturerRepository.findById(id);
        if (lecturer != null) {
            lecturerRepository.delete(lecturer);
            return true;
        }
        return false;
    }

    
    public Admin getAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public List<Student> getAllStudents(){
        return studentRepository.listAll();
    }

    public List<Lecturer> getAllLecturers(){
        return lecturerRepository.listAll();
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

    @Transactional
    public Student createStudent(Student student) {
        try {
            String token = keycloakAdminClient.getAdminToken();
            keycloakAdminClient.createUserAndAssignRole(token,student.getFirstName(), student.getLastName(), student.getEmail(), student.getEmail(), student.getPassword(), "student");
        } catch (Exception e) {
            throw new RuntimeException("Keycloak user creation failed: " + e.getMessage());
        }
        if (student.getDepartment() == null) {
            throw new RuntimeException("Department must be set on student");
        }
        studentRepository.persist(student);
        return student;
    }

    @Transactional
    public Lecturer createLecturer(Lecturer lecturer) {
        try {
            String token = keycloakAdminClient.getAdminToken();
            keycloakAdminClient.createUserAndAssignRole(token,lecturer.getFirstName(),lecturer.getLastName(), lecturer.getEmail(), lecturer.getEmail(), lecturer.getPassword(), "lecturer");
        } catch (Exception e) {
            throw new RuntimeException("Keycloak user creation failed: " + e.getMessage());
        }
        if (lecturer.getDepartment() == null) {
            throw new RuntimeException("Department must be set on lecturer");
        }
        lecturerRepository.persist(lecturer);
        return lecturer;
    }
}
