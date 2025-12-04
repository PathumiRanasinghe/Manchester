
package com.university.service;

import com.university.entity.Module;
import com.university.repository.EnrollmentRepository;
import com.university.repository.ModuleRepository;
import com.university.repository.StudentRepository;
import jakarta.inject.Inject;
import jakarta.annotation.security.PermitAll;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class ModuleService {
	@Inject
	EnrollmentRepository enrollmentRepository;

	@Inject
	StudentRepository studentRepository;

	@Inject
	ModuleRepository moduleRepository;

	public List<com.university.entity.Student> getStudentsForModule(Integer moduleId) {
		List<com.university.entity.Enrollment> enrollments = enrollmentRepository.find("module.moduleId", moduleId).list();
		List<com.university.entity.Student> students = new java.util.ArrayList<>();
		for (com.university.entity.Enrollment enrollment : enrollments) {
			com.university.entity.Student student = studentRepository.findById(enrollment.getStudent().getStudentId().longValue());
			if (student != null) {
				students.add(student);
			}
		}
		return students;
	}

	public List<Module> getModulesByStudentId(Integer studentId) {
		List<com.university.entity.Enrollment> enrollments = enrollmentRepository.find("student.studentId", studentId).list();
		List<Module> modules = new java.util.ArrayList<>();
		for (com.university.entity.Enrollment enrollment : enrollments) {
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

	
	public List<Module> getAllModules() {
		return moduleRepository.listAll();
	}

	public Module getModuleById(Long id) {
		return moduleRepository.findById(id);
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
			module.setModuleName(updatedModule.getModuleName());
			module.setCredits(updatedModule.getCredits());
			module.setLecturer(updatedModule.getLecturer());
			module.setDepartment(updatedModule.getDepartment());
			moduleRepository.persist(module);
		}
		return module;
	}

	@Transactional
	public boolean deleteModule(Long id) {
		return moduleRepository.deleteById(id);
	}

}
