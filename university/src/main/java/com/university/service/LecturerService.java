package com.university.service;

import jakarta.ws.rs.core.Response;
import com.university.dto.PaginatedResponse;
import com.university.dto.LecturerDto;

public interface LecturerService {

    PaginatedResponse<LecturerDto> getAllLecturers(int page, int pageSize);

    public Response getLecturersByDepartmentId(Long departmentId);

    public Response getLecturerByIdResponse(Long id);

    public Response getLecturerByEmailResponse(String email);

    public Response createLecturerResponse(LecturerDto lecturerDto);

    public Response deleteLecturerResponse(Long id);
}
