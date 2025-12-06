package com.university.service;

import com.university.entity.Enrollment;
import com.university.entity.Student;
import com.university.entity.Module;
import com.university.repository.EnrollmentRepository;
import com.university.repository.ModuleRepository;
import com.university.repository.StudentRepository;
import com.university.exception.UserNotFoundException;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class StudentService {
	@Inject
	EnrollmentRepository enrollmentRepository;
	@Inject
	ModuleRepository moduleRepository;
	@Inject
	StudentRepository studentRepository;
	@Inject
	KeycloakAdminClient keycloakAdminClient;

	public List<Student> getAllStudents() {
		return studentRepository.listAll();
	}

	public Student getStudentById(Long id) {
		Student student = studentRepository.findById(id);
		if (student == null) {
			throw new UserNotFoundException("Student with id " + id + " not found");
		}
		return student;
	}

	public Student getStudentByEmail(String email) {
		Student student = studentRepository.findByEmail(email);
		if (student == null) {
			throw new UserNotFoundException("Student with email " + email + " not found");
		}
		return student;
	}

	public List<Module> getModulesForStudent(Integer studentId) {
		List<Enrollment> enrollments = enrollmentRepository.find("student.studentId", studentId).list();
		List<Module> modules = new java.util.ArrayList<>();
		for (Enrollment enrollment : enrollments) {
			Module module = moduleRepository.findById(enrollment.getModule().getModuleId().longValue());
			if (module != null) {
				modules.add(module);
			}
		}
		return modules;
	}

	@Transactional
	public Student createStudent(Student student) {
		try {
			String token = keycloakAdminClient.getAdminToken();
			keycloakAdminClient.createUserAndAssignRole(token, student.getFirstName(), student.getLastName(),
					student.getEmail(), student.getEmail(), student.getPassword(), "student");
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


}
