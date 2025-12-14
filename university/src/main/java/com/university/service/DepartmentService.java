package com.university.service;

import com.university.entity.Department;
import com.university.dto.PaginatedResponse;
import com.university.dto.DepartmentDto;

public interface DepartmentService {
    PaginatedResponse<DepartmentDto> getAllDepartments(Integer page, Integer pageSize);
    public Department getDepartmentById(Long id);
    public Department createDepartment(Department department);
    public Department updateDepartment(Long id, Department updatedDepartment);	
}
