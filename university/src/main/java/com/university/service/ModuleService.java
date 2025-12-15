package com.university.service;

import jakarta.ws.rs.core.Response;
import java.util.List;
import com.university.dto.ModuleDto;
import com.university.dto.PaginatedResponse;
import com.university.entity.Module;

public interface ModuleService {
    public PaginatedResponse<ModuleDto> getAllModules(Integer page, Integer pageSize);

    public List<Module> getModulesByStudentId(Long studentId);

    public List<Module> getModulesByLecturerId(Integer lecturerId);

    public List<Module> getModulesByDepartmentId(Integer departmentId);

    public Response getModuleByIdResponse(Long id);

    public Response createModuleResponse(ModuleDto moduleDto);

    public Response updateModuleResponse(Long id, ModuleDto moduleDto);

    public Response deleteModuleResponse(Long id);
}
