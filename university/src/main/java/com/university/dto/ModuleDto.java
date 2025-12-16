package com.university.dto;

import jakarta.validation.constraints.NotBlank;

public class ModuleDto {
    @NotBlank
    private Long moduleId;
    @NotBlank
    private String moduleName;
    @NotBlank
    private Integer credits;
    @NotBlank
    private LecturerDto lecturer;
    @NotBlank
    private DepartmentDto department;
    @NotBlank
    private String description;
    
    public ModuleDto() {}

    public ModuleDto(Long moduleId, String moduleName, Integer credits, LecturerDto lecturer, DepartmentDto department, String description) {
        this.moduleId = moduleId;
        this.moduleName = moduleName;
        this.credits = credits;
        this.lecturer = lecturer;
        this.department = department;
        this.description = description;
    }
    
    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public LecturerDto getLecturer() {
        return lecturer;
    }

    public void setLecturer(LecturerDto lecturer) {
        this.lecturer = lecturer;
    }

    public DepartmentDto getDepartment() {
        return department;
    }

    public void setDepartment(DepartmentDto department) {
        this.department = department;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


}