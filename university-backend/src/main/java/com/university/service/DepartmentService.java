package com.university.service;

import com.university.entity.Department;
import com.university.repository.DeparmentRepository;
import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class DepartmentService {

	@Inject
	DeparmentRepository deparmentRepository;

	public List<Department> getAllDepartments() {
		return deparmentRepository.listAll();
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
			department.setModules(updatedDepartment.getModules());
			department.setStudents(updatedDepartment.getStudents());
			department.setLecturers(updatedDepartment.getLecturers());
			deparmentRepository.persist(department);
		}
		return department;
	}

	@Transactional
	public boolean deleteDepartment(Long id) {
		return deparmentRepository.deleteById(id);
	}
}
