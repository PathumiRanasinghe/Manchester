package com.university.service;

import jakarta.ws.rs.core.Response;
import com.university.dto.EnrollmentDto;
import com.university.dto.PaginatedResponse;

public interface EnrollmentService {

	PaginatedResponse<EnrollmentDto> getEnrollmentsPagedDto(Integer page, Integer pageSize);

	PaginatedResponse<EnrollmentDto> getEnrollmentsByStudentId(Long studentId);

	public Response getEnrollmentByIdResponse(Long id);

	public Response createEnrollmentResponse(EnrollmentDto enrollmentDto);

	public Response deleteEnrollmentResponse(Long id);
}
