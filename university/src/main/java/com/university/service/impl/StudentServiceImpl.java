package com.university.service.impl;

import com.university.entity.Enrollment;
import com.university.entity.Student;
import com.university.repository.EnrollmentRepository;
import com.university.repository.StudentRepository;
import com.university.service.KeycloakAdminClient;
import com.university.service.StudentService;
import com.university.service.DepartmentService;
import com.university.exception.UserNotFoundException;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class StudentServiceImpl implements StudentService {
	@Inject
	private EnrollmentRepository enrollmentRepository;
	@Inject
	private StudentRepository studentRepository;
	@Inject
	private KeycloakAdminClient keycloakAdminClient;
	@Inject
	private DepartmentService departmentService;

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

	@Transactional
	public Student createStudent(Student student) {
		try {
			String token = keycloakAdminClient.getAdminToken();
			keycloakAdminClient.createUserAndAssignRole(token, student.getFirstName(), student.getLastName(),
					student.getEmail(), student.getEmail(), student.getPassword(), "student");
		} catch (Exception e) {
			throw new RuntimeException("Keycloak user creation failed: " + e.getMessage());
		}
		if (student.getDepartment() == null || student.getDepartment().getDepartmentId() == null) {
			throw new RuntimeException("Department must be set on student");
		}
		Long deptId = student.getDepartment().getDepartmentId();
		com.university.entity.Department managedDept = departmentService.getDepartmentById(deptId);
		if (managedDept == null) {
			throw new RuntimeException("Department not found for id: " + deptId);
		}
		student.setDepartment(managedDept);
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

		public List<Student> getStudentsByModuleId(Integer moduleId) {
			List<Enrollment> enrollments = enrollmentRepository.find("module.moduleId", moduleId).list();
			List<Student> students = new java.util.ArrayList<>();
			for (Enrollment enrollment : enrollments) {
				Student student = studentRepository.findById(enrollment.getStudent().getStudentId().longValue());
				if (student != null) {
					students.add(student);
				}
			}
			return students;
		}

		public List<com.university.entity.Module> getModulesByStudentId(Long studentId) {
			List<Enrollment> enrollments = enrollmentRepository.find("student.studentId", studentId).list();
			List<com.university.entity.Module> modules = new java.util.ArrayList<>();
			for (Enrollment enrollment : enrollments) {
				if (enrollment.getModule() != null) {
					modules.add(enrollment.getModule());
				}
			}
			return modules;
		}

}
