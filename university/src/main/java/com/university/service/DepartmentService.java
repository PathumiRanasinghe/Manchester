package com.university.service;

import jakarta.ws.rs.core.Response;
import com.university.dto.PaginatedResponse;
import com.university.dto.DepartmentDto;

public interface DepartmentService {
    PaginatedResponse<DepartmentDto> getAllDepartments(Integer page, Integer pageSize);

    public Response getDepartmentById(Long id);

    public Response createDepartment(DepartmentDto departmentDto);

    public Response updateDepartment(Long id, DepartmentDto updatedDepartmentDto);
}
