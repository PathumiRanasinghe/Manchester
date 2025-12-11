
package com.university.service.impl;

import com.university.entity.Lecturer;
import com.university.entity.Module;
import com.university.repository.LecturerRepository;
import com.university.repository.ModuleRepository;
import com.university.service.KeycloakAdminClient;
import com.university.service.LecturerService;
import com.university.exception.UserNotFoundException;
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

	public List<Lecturer> getAllLecturers() {
		return lecturerRepository.listAll();
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
			String token = keycloakAdminClient.getAdminToken();
			keycloakAdminClient.deleteUserByUsername(token, lecturer.getEmail());
		} catch (Exception e) {
			throw new RuntimeException("Keycloak user deletion failed: " + e.getMessage());
		}
		lecturerRepository.delete(lecturer);
		return true;
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

	public java.util.List<Lecturer> getLecturersByDepartmentId(Long departmentId) {
		return lecturerRepository.findByDepartmentId(departmentId);
	}

}
