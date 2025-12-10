package com.university.service;

import java.util.List;
import com.university.entity.Department;

public interface DepartmentService {
    public List<Department> getAllDepartments();
    public Department getDepartmentById(Long id);
    public Department createDepartment(Department department);
    public Department updateDepartment(Long id, Department updatedDepartment);	
}
