package com.university.service.impl;

import com.university.entity.Enrollment;
import com.university.repository.EnrollmentRepository;
import com.university.service.EnrollmentService;

import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class EnrollmentServiceImpl implements EnrollmentService{

	@Inject
	private EnrollmentRepository enrollmentRepository;

	public List<Enrollment> getAllEnrollments() {
		return enrollmentRepository.listAll();
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
}
