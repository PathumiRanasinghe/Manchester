package com.university.service;

import com.university.entity.Enrollment;
import com.university.dto.EnrollmentDto;
import com.university.dto.PaginatedResponse;

public interface EnrollmentService {

	PaginatedResponse<EnrollmentDto> getEnrollmentsPagedDto(Integer page, Integer pageSize);

	Enrollment getEnrollmentById(Long id);

	Enrollment createEnrollment(Enrollment enrollment);

	boolean deleteEnrollment(Long id);

	PaginatedResponse<EnrollmentDto> getEnrollmentsByStudentId(Long studentId);
}
