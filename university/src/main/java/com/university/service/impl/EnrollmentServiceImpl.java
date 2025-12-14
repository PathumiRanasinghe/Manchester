package com.university.service.impl;

import com.university.entity.Enrollment;
import com.university.repository.EnrollmentRepository;
import com.university.service.EnrollmentService;
import com.university.dto.EnrollmentDto;
import com.university.dto.PaginatedResponse;
import com.university.mapper.EnrollmentMapper;

import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class EnrollmentServiceImpl implements EnrollmentService{
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

    public Enrollment getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id);
    }

    @Transactional
    public Enrollment createEnrollment(Enrollment enrollment) {
        enrollmentRepository.persist(enrollment);
        return enrollment;
    }

    @Transactional
    public boolean deleteEnrollment(Long id) {
        return enrollmentRepository.deleteById(id);
    }

    public PaginatedResponse<EnrollmentDto> getEnrollmentsByStudentId(Long studentId) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        List<EnrollmentDto> dtos = enrollments.stream().map(EnrollmentMapper::toDto).toList();
        return new PaginatedResponse<>(dtos, dtos.size(), 1, dtos.size());
    }
}
