package com.university.service;

import java.util.List;

import com.university.dto.ModuleDto;
import com.university.dto.PaginatedResponse;
import com.university.entity.Module;

public interface ModuleService {
    public PaginatedResponse<ModuleDto> getAllModules(Integer page, Integer pageSize);

    public Module getModuleById(Long id);

    public List<Module> getModulesByStudentId(Long studentId);

    public List<Module> getModulesByLecturerId(Integer lecturerId);

    public List<Module> getModulesByDepartmentId(Integer departmentId);

    public Module createModule(Module module);

    public Module updateModule(Long id, Module updatedModule);

    public boolean deleteModule(Long id);
}
