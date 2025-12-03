package com.university.service;

import com.university.entity.Enrollment;
import com.university.repository.EnrollmentRepository;
import com.university.repository.ModuleRepository;
import com.university.repository.StudentRepository;

import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class EnrollmentService {

	@Inject
	EnrollmentRepository enrollmentRepository;

	@Inject
	StudentRepository studentRepository;

	@Inject
	ModuleRepository moduleRepository;

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
	public Enrollment updateEnrollment(Long id, Enrollment updatedEnrollment) {
		Enrollment enrollment = enrollmentRepository.findById(id);
		if (enrollment != null) {
			enrollment.setStudent(updatedEnrollment.getStudent());
			enrollment.setModule(updatedEnrollment.getModule());
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
