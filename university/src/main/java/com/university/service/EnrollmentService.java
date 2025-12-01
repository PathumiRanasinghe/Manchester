package com.university.service;

import com.university.entity.Enrollment;
import com.university.entity.Student;
import com.university.entity.Module;
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

	/**
	 * Enroll a student to a module by their IDs. This method expects an Enrollment object
	 * with only studentId and moduleId set, or you can refactor your controller to accept those IDs directly.
	 */
	@Transactional
	public Enrollment createEnrollment(Enrollment enrollment) {
		// Defensive: Accept only studentId and moduleId, ignore other fields
		Integer studentId = (enrollment.getStudent() != null) ? enrollment.getStudent().getStudentId() : null;
		Integer moduleId = (enrollment.getModule() != null) ? enrollment.getModule().getModuleId() : null;

		if (studentId == null || moduleId == null) {
			throw new IllegalArgumentException("StudentId and ModuleId must be provided.");
		}

		Student managedStudent = studentRepository.findById(studentId.longValue());
		Module managedModule = moduleRepository.findById(moduleId.longValue());

		if (managedStudent == null || managedModule == null) {
			throw new IllegalArgumentException("Student or Module not found.");
		}

		boolean exists = enrollmentRepository.find("student = ?1 and module = ?2", managedStudent, managedModule).firstResult() != null;
		if (exists) {
			throw new IllegalArgumentException("Student is already enrolled in this module.");
		}

		Enrollment newEnrollment = new Enrollment();
		newEnrollment.setStudent(managedStudent);
		newEnrollment.setModule(managedModule);
		newEnrollment.setEnrollmentDate(java.time.LocalDateTime.now());
		enrollmentRepository.persist(newEnrollment);
		return newEnrollment;
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
