package com.university.mapper;

import com.university.dto.ModuleDto;
import com.university.entity.Module;

public class ModuleMapper {
    public static Module toEntity(ModuleDto dto) {
        if (dto == null)
            return null;
        Module module = new Module();
        module.setModuleId(dto.getModuleId());
        module.setModuleName(dto.getModuleName());
        module.setDescription(dto.getDescription());
        module.setCredits(dto.getCredits());
        module.setLecturer(LecturerMapper.toEntity(dto.getLecturer()));
        module.setDepartment(DepartmentMapper.toEntity(dto.getDepartment()));
        return module;
    }

    public static ModuleDto toDto(Module module) {
        if (module == null)
            return null;
        return new ModuleDto(
                module.getModuleId(),
                module.getModuleName(),
                module.getCredits(),
                LecturerMapper.toDto(module.getLecturer()),
                DepartmentMapper.toDto(module.getDepartment()),
                module.getDescription()
        );
    }
}
