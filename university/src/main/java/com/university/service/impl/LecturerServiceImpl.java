package com.university.service.impl;

import com.university.dto.LecturerDto;
import com.university.dto.PaginatedResponse;
import com.university.entity.Lecturer;
import com.university.entity.Module;
import com.university.repository.LecturerRepository;
import com.university.repository.ModuleRepository;
import com.university.service.KeycloakAdminClient;
import com.university.service.LecturerService;
import com.university.exception.DuplicateEmailException;
import com.university.exception.UserNotFoundException;
import com.university.mapper.LecturerMapper;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class LecturerServiceImpl implements LecturerService {
	@Inject
	private LecturerRepository lecturerRepository;

	@Inject
	private KeycloakAdminClient keycloakAdminClient;

	@Inject
	private ModuleRepository moduleRepository;

	public Lecturer getLecturerByEmail(String email) {
		Lecturer lecturer = lecturerRepository.findByEmail(email);
		if (lecturer == null) {
			throw new UserNotFoundException("Lecturer with email " + email + " not found");
		}
		return lecturer;
	}

	public PaginatedResponse<LecturerDto> getAllLecturers(int page, int pageSize) {
		if (page < 1) page = 1;
		if (pageSize < 1) pageSize = 10;

		List<Lecturer> lecturers = lecturerRepository.findPaged(page, pageSize);
		long total = lecturerRepository.countAll();
		List<LecturerDto> dtos = lecturers.stream().map(LecturerMapper::toDto).toList();
		return new PaginatedResponse<>(dtos, total, page, pageSize);
	}

	public Lecturer getLecturerById(Long id) {
		Lecturer lecturer = lecturerRepository.findById(id);
		if (lecturer == null) {
			throw new UserNotFoundException("Lecturer with id " + id + " not found");
		}
		return lecturer;
	}

	@Transactional
	public boolean deleteLecturer(Long id) {
		Lecturer lecturer = lecturerRepository.findById(id);
		if (lecturer == null) {
			return false;
		}
		List<Module> modules = moduleRepository.find("lecturer.lecturerId", lecturer.getLecturerId()).list();
		if (modules != null && !modules.isEmpty()) {
			return false;
		}
		try {
			keycloakAdminClient.deleteUserByUsername(lecturer.getEmail());
		} catch (Exception e) {
			throw new RuntimeException("Keycloak user deletion failed: " + e.getMessage());
		}
		lecturerRepository.delete(lecturer);
		return true;
	}

	@Transactional
	public Lecturer createLecturer(Lecturer lecturer) {
		if (lecturerRepository.findByEmail(lecturer.getEmail()) != null) {
			   throw new DuplicateEmailException("A lecturer with this email already exists.");
		}
		try {
			keycloakAdminClient.createUserAndAssignRole(lecturer.getFirstName(), lecturer.getLastName(), lecturer.getEmail(), lecturer.getPassword(), "lecturer");
		} catch (Exception e) {
			throw new RuntimeException("Keycloak user creation failed: " + e.getMessage());
		}
		if (lecturer.getDepartment() == null) {
			throw new RuntimeException("Department must be set on lecturer");
		}
		lecturerRepository.persist(lecturer);
		return lecturer;
	}

	public List<Lecturer> getLecturersByDepartmentId(Long departmentId) {
		return lecturerRepository.findByDepartmentId(departmentId);
	}

}
