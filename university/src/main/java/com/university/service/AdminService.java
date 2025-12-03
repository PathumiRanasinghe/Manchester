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
}
