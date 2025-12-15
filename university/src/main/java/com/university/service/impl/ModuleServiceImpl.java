package com.university.service.impl;
import jakarta.ws.rs.core.Response;
import com.university.dto.ModuleDto;
import com.university.mapper.DepartmentMapper;
import com.university.mapper.LecturerMapper;
import com.university.mapper.ModuleMapper;
import com.university.dto.DepartmentDto;
import com.university.dto.LecturerDto;
import com.university.entity.Enrollment;
import com.university.entity.Module;
import com.university.repository.EnrollmentRepository;
import com.university.repository.ModuleRepository;
import com.university.service.ModuleService;
import com.university.dto.PaginatedResponse;
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

	 public Response getModuleByIdResponse(Long id) {
		Module module = moduleRepository.findById(id);
		if (module == null) {
			return Response.status(Response.Status.NOT_FOUND).entity("Module not found").build();
		}	
		return Response.ok(ModuleMapper.toDto(module)).build();
	}

	@Transactional
	public Response createModuleResponse(ModuleDto moduleDto) {
		LecturerDto lecturerDto = moduleDto.getLecturer();
		DepartmentDto departmentDto = moduleDto.getDepartment();
		Long lecturerId = lecturerDto != null ? lecturerDto.getLecturerId() : null;
		Long departmentId = departmentDto != null ? departmentDto.getDepartmentId() : null;
		if (lecturerId == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity("Lecturer ID is required").build();
		}
		if (lecturerDto == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity("Lecturer not found").build();
		}
		if (departmentId == null && lecturerDto.getDepartment() != null) {
			departmentId = lecturerDto.getDepartment().getDepartmentId();
			departmentDto = null;
		}
		if (departmentId == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity("Department ID is required").build();
		}
		Module module = ModuleMapper.toEntity(moduleDto);
		module.setLecturer(LecturerMapper.toEntity(lecturerDto));
		module.setDepartment(DepartmentMapper.toEntity(departmentDto));
		moduleRepository.persist(module);
		return Response.status(Response.Status.CREATED).entity(ModuleMapper.toDto(module)).build();
	}

	@Transactional
	public Response updateModuleResponse(Long id, ModuleDto moduleDto) {
		Module module = moduleRepository.findById(id);
		if (module == null) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}
		if (moduleDto.getModuleName() != null) {
			module.setModuleName(moduleDto.getModuleName());
		}
		if (moduleDto.getDescription() != null) {
			module.setDescription(moduleDto.getDescription());
		}
		if (moduleDto.getCredits() != null) {
			module.setCredits(moduleDto.getCredits());
		}
		if (moduleDto.getLecturer() != null && moduleDto.getLecturer().getLecturerId() != null) {
			LecturerDto lecturer = moduleDto.getLecturer();
			module.setLecturer(LecturerMapper.toEntity(lecturer));
		}
		moduleRepository.persist(module);
		return Response.ok(ModuleMapper.toDto(module)).build();
	}

	@Transactional
	public Response deleteModuleResponse(Long id) {
		boolean deleted = moduleRepository.deleteById(id);
		if (deleted) {
			return Response.noContent().build();
		} else {
			return Response.status(Response.Status.NOT_FOUND).build();
		}
	}


}
