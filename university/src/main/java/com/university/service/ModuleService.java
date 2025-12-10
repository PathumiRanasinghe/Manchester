package com.university.service;

import java.util.List;
import com.university.entity.Module;

public interface ModuleService {
    public List<Module> getAllModules();

    public Module getModuleById(Long id);

    public List<Module> getModulesByStudentId(Integer studentId);

    public List<Module> getModulesByLecturerId(Integer lecturerId);

    public List<Module> getModulesByDepartmentId(Integer departmentId);

    public Module createModule(Module module);

    public Module updateModule(Long id, Module updatedModule);

    public boolean deleteModule(Long id);
}
