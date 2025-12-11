package com.university.mapper;

import com.university.dto.EnrollmentDto;
import com.university.entity.Enrollment;

public class EnrollmentMapper {
    public static Enrollment toEntity(EnrollmentDto dto) {
        if (dto == null)
            return null;
        Enrollment enrollment = new Enrollment();
        enrollment.setEnrollmentId(dto.getEnrollmentId());
        enrollment.setStudent(StudentMapper.toEntity(dto.getStudent()));
        enrollment.setModule(ModuleMapper.toEntity(dto.getModule()));
        enrollment.setEnrollmentDate(dto.getEnrollmentDate());
        return enrollment;
    }

    public static EnrollmentDto toDto(Enrollment enrollment) {
        if (enrollment == null)
            return null;
        return new EnrollmentDto(
                enrollment.getEnrollmentId(),
                StudentMapper.toDto(enrollment.getStudent()),
                ModuleMapper.toDto(enrollment.getModule()),
                enrollment.getEnrollmentDate()
        );
    }
}
