package com.university.service.impl;

import com.university.mapper.DepartmentMapper;
import jakarta.ws.rs.core.Response;
import java.util.List;

import com.university.dto.DepartmentDto;
import com.university.dto.PaginatedResponse;
import com.university.entity.Department;
import com.university.repository.DeparmentRepository;
import com.university.service.DepartmentService;
import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class DepartmentServiceImpl implements DepartmentService {

	@Inject
	private DeparmentRepository deparmentRepository;

	public PaginatedResponse<DepartmentDto> getAllDepartments(Integer page, Integer pageSize) {
		int pageNum = (page != null && page > 0) ? page : 1;
		int size = (pageSize != null && pageSize > 0) ? pageSize : 10;
		List<Department> departments = deparmentRepository.findPaged(pageNum, size);
		long total = deparmentRepository.countAll();
		List<DepartmentDto> dtos = departments.stream().map(DepartmentMapper::toDto).toList();
		return new PaginatedResponse<>(dtos, total, pageNum, size);
	}

	public Response getDepartmentById(Long id) {
		Department department = deparmentRepository.findById(id);
		if (department == null) {
			return Response.status(Response.Status.NOT_FOUND).entity("Department not found").build();
		}
		return Response.ok(DepartmentMapper.toDto(department)).build();
	}

	@Transactional
	public Response createDepartment(DepartmentDto departmentDto) {
		Department created = DepartmentMapper.toEntity(departmentDto);
		deparmentRepository.persist(created);
		return Response.status(Response.Status.CREATED).entity(DepartmentMapper.toDto(created)).build();
	}

	@Transactional
	public Response updateDepartment(Long id, DepartmentDto updatedDepartmentDto) {
		Department department = DepartmentMapper.toEntity(updatedDepartmentDto);
		department.setDepartmentId(id);
		Department updated = deparmentRepository.findById(id);
		if (updated != null) {
			updated.setDepartmentName(updatedDepartmentDto.getDepartmentName());
			updated.setDescription(updatedDepartmentDto.getDescription());
			deparmentRepository.persist(updated);
		}
		if (updated == null) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}
		return Response.ok(DepartmentMapper.toDto(updated)).build();
	}
}
