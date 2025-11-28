package com.university.service;

import com.university.entity.Module;
import com.university.repository.ModuleRepository;
import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class ModuleService {

	@Inject
	ModuleRepository moduleRepository;

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
			module.setName(updatedModule.getName());
			module.setCredits(updatedModule.getCredits());
			module.setDepartment(updatedModule.getDepartment());
			module.setLecturer(updatedModule.getLecturer());
			module.setEnrollments(updatedModule.getEnrollments());
			moduleRepository.persist(module);
		}
		return module;
	}

	@Transactional
	public boolean deleteModule(Long id) {
		return moduleRepository.deleteById(id);
	}
}
