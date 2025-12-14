package com.university.service;

import java.util.List;
import com.university.entity.Lecturer;
import com.university.dto.PaginatedResponse;
import com.university.dto.LecturerDto;

public interface LecturerService {
    
    public Lecturer getLecturerByEmail(String email);

    PaginatedResponse<LecturerDto> getAllLecturers(int page, int pageSize);

    public Lecturer getLecturerById(Long id);

    public boolean deleteLecturer(Long id);

    public Lecturer createLecturer(Lecturer lecturer);

    public List<Lecturer> getLecturersByDepartmentId(Long departmentId);
}
