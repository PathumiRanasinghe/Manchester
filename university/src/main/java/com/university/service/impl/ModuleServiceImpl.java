
package com.university.service.impl;

import com.university.entity.Enrollment;
import com.university.entity.Module;
import com.university.repository.EnrollmentRepository;
import com.university.repository.ModuleRepository;
import com.university.service.ModuleService;
import com.university.dto.PaginatedResponse;
import com.university.dto.ModuleDto;
import com.university.mapper.ModuleMapper;
import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class ModuleServiceImpl implements ModuleService {
	@Inject
	private EnrollmentRepository enrollmentRepository;

	@Inject
	private ModuleRepository moduleRepository;

	public PaginatedResponse<ModuleDto> getAllModules(Integer page, Integer pageSize) {
		 int pageNum = (page != null && page > 0) ? page : 1;
		int size = (pageSize != null && pageSize > 0) ? pageSize : 10;

		List<Module> modules = moduleRepository.findPaged(pageNum, size);
		long total = moduleRepository.countAll();
		List<ModuleDto> dtos = modules.stream().map(ModuleMapper::toDto).toList();
		return new PaginatedResponse<>(dtos, total, pageNum, size);
	}

	public Module getModuleById(Long id) {
		return moduleRepository.findById(id);
	}

	public List<Module> getModulesByStudentId(Long studentId) {
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

	public List<Module> getModulesByLecturerId(Integer lecturerId) {
		return moduleRepository.find("lecturer.lecturerId", lecturerId).list();
	}

	public List<Module> getModulesByDepartmentId(Integer departmentId) {
		return moduleRepository.find("department.departmentId", departmentId).list();
	}

	@Transactional
	public Module createModule(Module module) {
		moduleRepository.persist(module);
		return module;
	}

	@Transactional
	public Module updateModule(Long id, Module updatedModule) {
		Module module = moduleRepository.findById(id);
		if (module != null) {
			if (updatedModule.getModuleName() != null) {
				module.setModuleName(updatedModule.getModuleName());
			}
			if (updatedModule.getCredits() != null) {
				module.setCredits(updatedModule.getCredits());
			}
			if (updatedModule.getLecturer() != null) {
				module.setLecturer(updatedModule.getLecturer());
			}
			if (updatedModule.getDepartment() != null) {
				module.setDepartment(updatedModule.getDepartment());
			}
			if (updatedModule.getDescription() != null) {
				module.setDescription(updatedModule.getDescription());
			}
			moduleRepository.persist(module);
		}
		return module;
	}

	@Transactional
	public boolean deleteModule(Long id) {
		return moduleRepository.deleteById(id);
	}

}
