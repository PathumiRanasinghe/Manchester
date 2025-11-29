package com.university.service;

import com.university.entity.Enrollment;
import com.university.repository.EnrollmentRepository;
import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class EnrollmentService {

	@Inject
	EnrollmentRepository enrollmentRepository;

	public List<Enrollment> getAllEnrollments() {
		return enrollmentRepository.listAll();
	}

	public Enrollment getEnrollmentById(Long id) {
		return enrollmentRepository.findById(id);
	}

	@Transactional
	public Enrollment createEnrollment(Enrollment enrollment) {
		boolean exists = enrollmentRepository.find("studentId = ?1 and moduleId = ?2", enrollment.getStudentId(), enrollment.getModuleId()).firstResult() != null;
		if (exists) {
			throw new IllegalArgumentException("Student is already enrolled in this module.");
		}
		enrollmentRepository.persist(enrollment);
		return enrollment;
	}

	@Transactional
	public Enrollment updateEnrollment(Long id, Enrollment updatedEnrollment) {
		Enrollment enrollment = enrollmentRepository.findById(id);
		if (enrollment != null) {
			enrollment.setStudentId(updatedEnrollment.getStudentId());
			enrollment.setModuleId(updatedEnrollment.getModuleId());
			enrollment.setEnrollmentDate(updatedEnrollment.getEnrollmentDate());
			enrollmentRepository.persist(enrollment);
		}
		return enrollment;
	}

	@Transactional
	public boolean deleteEnrollment(Long id) {
		return enrollmentRepository.deleteById(id);
	}
}
