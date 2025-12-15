package com.university.service.impl;

import jakarta.ws.rs.core.Response;
import com.university.mapper.StudentMapper;
import com.university.dto.PaginatedResponse;
import com.university.dto.StudentDto;
import com.university.entity.Enrollment;
import com.university.entity.Student;
import com.university.repository.EnrollmentRepository;
import com.university.repository.StudentRepository;
import com.university.service.KeycloakAdminClient;
import com.university.service.StudentService;
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

	public PaginatedResponse<StudentDto> getAllStudents(Integer page, Integer pageSize) {
		int pageNum = (page != null && page > 0) ? page : 1;
		int size = (pageSize != null && pageSize > 0) ? pageSize : 10;

		List<Student> students = studentRepository.findPaged(pageNum, size);
		long total = studentRepository.countAll();
		List<StudentDto> dtos = students.stream().map(StudentMapper::toDto).toList();
		
		return new PaginatedResponse<>(dtos, total, pageNum, size);
	}

	public Response getStudentsByModuleIdResponse(Integer moduleId) {
		List<Enrollment> enrollments = enrollmentRepository.find("module.moduleId", moduleId).list();
		List<Student> students = new java.util.ArrayList<>();
		for (Enrollment enrollment : enrollments) {
			Student student = studentRepository.findById(enrollment.getStudent().getStudentId().longValue());
			if (student != null) {
				students.add(student);
			}
		}
		if (students.isEmpty()) {
			return Response.status(Response.Status.NOT_FOUND).entity("No students found for this module").build();
		}
		List<StudentDto> dtos = students.stream().map(StudentMapper::toDto).toList();
		return Response.ok(dtos).build();
	}

	public Response getStudentByIdResponse(Long id) {
		Student student;
		try {
			student = studentRepository.findById(id);
		} catch (UserNotFoundException e) {
			return Response.status(Response.Status.NOT_FOUND).entity("Student not found").build();
		}
		return Response.ok(StudentMapper.toDto(student)).build();
	}

	public Response getStudentByEmailResponse(String email) {
		Student student;
		try {
			student = studentRepository.findByEmail(email);
		} catch (UserNotFoundException e) {
			return Response.status(Response.Status.NOT_FOUND).entity("Student not found").build();
		}
		return Response.ok(StudentMapper.toDto(student)).build();
	}

	@Transactional
	public Response createStudentResponse(StudentDto studentDto) {
		Student student = StudentMapper.toEntity(studentDto);
		if (studentRepository.findByEmail(student.getEmail()) != null) {
			return Response.status(Response.Status.CONFLICT).entity("A student with this email already exists.").build();
		}
		try {
			keycloakAdminClient.createUserAndAssignRole(student.getFirstName(), student.getLastName(), student.getEmail(), student.getPassword(), "student");
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Keycloak user creation failed: " + e.getMessage()).build();
		}
		if (student.getDepartment() == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity("Department must be specified for student creation.").build();
		}
		studentRepository.persist(student);
		return Response.status(Response.Status.CREATED).entity(StudentMapper.toDto(student)).build();
	}

	@Transactional
	public Response deleteStudentResponse(Long id) {
		Student student = studentRepository.findById(id);
		if (student == null) {
			return Response.status(Response.Status.NOT_FOUND).entity("Student not found").build();
		}
		try {
			keycloakAdminClient.deleteUserByUsername(student.getEmail());
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Keycloak user deletion failed: " + e.getMessage()).build();
		}
		studentRepository.delete(student);
		return Response.noContent().build();
	}

}
