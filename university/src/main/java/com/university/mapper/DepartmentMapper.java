package com.university.mapper;

import com.university.dto.DepartmentDto;
import com.university.entity.Department;

public class DepartmentMapper {
    public static Department toEntity(DepartmentDto dto) {
        if (dto == null)
            return null;
        Department department = new Department();
        if (dto.getDepartmentId() != null) {
            department.setDepartmentId(dto.getDepartmentId());
        }
        department.setDepartmentName(dto.getDepartmentName());
        department.setDescription(dto.getDescription());
        return department;
    }

    public static DepartmentDto toDto(Department department) {
        if (department == null)
            return null;
        return new DepartmentDto(
                department.getDepartmentId(),
                department.getDepartmentName(),
                department.getDescription());
    }
}
