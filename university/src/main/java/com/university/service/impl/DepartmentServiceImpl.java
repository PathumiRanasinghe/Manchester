package com.university.service.impl;

import java.util.List;

import com.university.dto.DepartmentDto;
import com.university.dto.PaginatedResponse;
import com.university.entity.Department;
import com.university.mapper.DepartmentMapper;
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

	public Department getDepartmentById(Long id) {
		return deparmentRepository.findById(id);
	}

	@Transactional
	public Department createDepartment(Department department) {
		deparmentRepository.persist(department);
		return department;
	}

	@Transactional
	public Department updateDepartment(Long id, Department updatedDepartment) {
		Department department = deparmentRepository.findById(id);
		if (department != null) {
			department.setDepartmentName(updatedDepartment.getDepartmentName());
			department.setDescription(updatedDepartment.getDescription());
			deparmentRepository.persist(department);
		}
		return department;
	}
}
