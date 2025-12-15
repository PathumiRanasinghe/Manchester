package com.university.service.impl;

import jakarta.ws.rs.core.Response;
import com.university.mapper.LecturerMapper;
import com.university.dto.LecturerDto;
import com.university.dto.PaginatedResponse;
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

	public PaginatedResponse<LecturerDto> getAllLecturers(int page, int pageSize) {
		if (page < 1) page = 1;
		if (pageSize < 1) pageSize = 10;

		List<Lecturer> lecturers = lecturerRepository.findPaged(page, pageSize);
		long total = lecturerRepository.countAll();
		List<LecturerDto> dtos = lecturers.stream().map(LecturerMapper::toDto).toList();
		return new PaginatedResponse<>(dtos, total, page, pageSize);
	}

	public Response getLecturersByDepartmentId(Long departmentId) {
		List<LecturerDto> lecturers = null;
		try{
			lecturers = lecturerRepository.findByDepartmentId(departmentId).stream().map(LecturerMapper::toDto).toList();
		} catch (UserNotFoundException e) {
			return Response.status(Response.Status.NOT_FOUND).entity("No lecturers found for the given department ID").build();
		}
		return Response.ok(lecturers).build();
	}

	public Response getLecturerByIdResponse(Long id) {
		Lecturer lecturer;
		try {
			lecturer = lecturerRepository.findById(id);
		} catch (UserNotFoundException e) {
			return Response.status(Response.Status.NOT_FOUND).entity("Lecturer not found").build();
		}
		return Response.ok(LecturerMapper.toDto(lecturer)).build();
	}

	public Response getLecturerByEmailResponse(String email) {
		Lecturer lecturer;
		try {
			lecturer = lecturerRepository.findByEmail(email);
		} catch (UserNotFoundException e) {
			return Response.status(Response.Status.NOT_FOUND).entity("Lecturer not found").build();
		}
		return Response.ok(LecturerMapper.toDto(lecturer)).build();
	}

	@Transactional
	public Response createLecturerResponse(LecturerDto lecturerDto) {
		Lecturer lecturer = LecturerMapper.toEntity(lecturerDto);
		if (lecturerRepository.findByEmail(lecturer.getEmail()) != null) {
			return Response.status(Response.Status.CONFLICT).entity("A lecturer with this email already exists.").build();
		}
		try {
			keycloakAdminClient.createUserAndAssignRole(lecturer.getFirstName(), lecturer.getLastName(), lecturer.getEmail(), lecturer.getPassword(), "lecturer");
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Keycloak user creation failed: " + e.getMessage()).build();
		}
		if (lecturer.getDepartment() == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity("Department must be set on lecturer").build();
		}
		lecturerRepository.persist(lecturer);
		return Response.status(Response.Status.CREATED).entity(LecturerMapper.toDto(lecturer)).build();
	}

	@Transactional
	public Response deleteLecturerResponse(Long id) {
		Lecturer lecturer = lecturerRepository.findById(id);
		if (lecturer == null) {
			return Response.status(Response.Status.NOT_FOUND).entity("Lecturer not found").build();
		}
		List<Module> modules = moduleRepository.find("lecturer.lecturerId", lecturer.getLecturerId()).list();
		if (modules != null && !modules.isEmpty()) {
			return Response.status(Response.Status.CONFLICT)
					.entity("Cannot delete lecturer: modules are assigned. Please reassign those modules to another lecturer before deleting.")
					.build();
		}
		try {
			keycloakAdminClient.deleteUserByUsername(lecturer.getEmail());
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Keycloak user deletion failed: " + e.getMessage()).build();
		}
		lecturerRepository.delete(lecturer);
		return Response.noContent().build();
	}

}
