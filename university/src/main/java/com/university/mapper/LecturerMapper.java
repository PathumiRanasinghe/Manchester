package com.university.mapper;

import com.university.dto.LecturerDto;
import com.university.entity.Lecturer;

public class LecturerMapper {
    public static Lecturer toEntity(LecturerDto dto) {
        if (dto == null)
            return null;
        Lecturer lecturer = new Lecturer();
        lecturer.setLecturerId(dto.getLecturerId());
        lecturer.setFirstName(dto.getFirstName());
        lecturer.setLastName(dto.getLastName());
        lecturer.setEmail(dto.getEmail());
        lecturer.setPassword(dto.getPassword());
        if (dto.getDepartment() != null) {
            lecturer.setDepartment(DepartmentMapper.toEntity(dto.getDepartment()));
        }
        return lecturer;
    }

    public static LecturerDto toDto(Lecturer lecturer) {
        if (lecturer == null)
            return null;
        return new LecturerDto(
            lecturer.getLecturerId(),
            lecturer.getFirstName(),
            lecturer.getLastName(),
            lecturer.getEmail(),
            DepartmentMapper.toDto(lecturer.getDepartment()),
            null
        );
    }
}
