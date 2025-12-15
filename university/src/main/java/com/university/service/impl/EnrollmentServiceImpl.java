package com.university.service.impl;

import jakarta.ws.rs.core.Response;
import com.university.mapper.EnrollmentMapper;
import com.university.entity.Enrollment;
import com.university.repository.EnrollmentRepository;
import com.university.service.EnrollmentService;
import com.university.dto.EnrollmentDto;
import com.university.dto.PaginatedResponse;
import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class EnrollmentServiceImpl implements EnrollmentService {
    @Inject
    private EnrollmentRepository enrollmentRepository;

    public PaginatedResponse<EnrollmentDto> getEnrollmentsPagedDto(Integer page, Integer pageSize) {
        int pageNum = (page != null && page > 0) ? page : 1;
        int size = (pageSize != null && pageSize > 0) ? pageSize : 10;
        List<Enrollment> enrollments = enrollmentRepository.findPaged(pageNum, size);
        long total = enrollmentRepository.countAll();
        List<EnrollmentDto> dtos = enrollments.stream().map(EnrollmentMapper::toDto).toList();
        return new PaginatedResponse<>(dtos, total, pageNum, size);
    }

    public PaginatedResponse<EnrollmentDto> getEnrollmentsByStudentId(Long studentId) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        List<EnrollmentDto> dtos = enrollments.stream().map(EnrollmentMapper::toDto).toList();
        return new PaginatedResponse<>(dtos, dtos.size(), 1, dtos.size());
    }

    public Response getEnrollmentByIdResponse(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id);
        if (enrollment == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Enrollment not found").build();
        }
        return Response.ok(EnrollmentMapper.toDto(enrollment)).build();
    }

    @Transactional
    public Response createEnrollmentResponse(EnrollmentDto enrollmentDto) {
        Enrollment enrollment = EnrollmentMapper.toEntity(enrollmentDto);
        enrollmentRepository.persist(enrollment);
        return Response.status(Response.Status.CREATED).entity(EnrollmentMapper.toDto(enrollment)).build();
    }

    @Transactional
    public Response deleteEnrollmentResponse(Long id) {
        boolean deleted = enrollmentRepository.deleteById(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}
