package com.university.service;

import jakarta.ws.rs.core.Response;
import com.university.dto.PaginatedResponse;
import com.university.dto.StudentDto;

public interface StudentService {
    PaginatedResponse<StudentDto> getAllStudents(Integer page, Integer pageSize);

    public Response getStudentsByModuleIdResponse(Integer moduleId);

    public Response getStudentByIdResponse(Long id);

    public Response getStudentByEmailResponse(String email);

    public Response createStudentResponse(StudentDto studentDto);

    public Response deleteStudentResponse(Long id);
}
