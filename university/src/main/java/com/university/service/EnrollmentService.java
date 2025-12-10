package com.university.service;

import java.util.List;
import com.university.entity.Enrollment;

public interface EnrollmentService {
    public List<Enrollment> getAllEnrollments();

	public Enrollment getEnrollmentById(Long id);

	public Enrollment createEnrollment(Enrollment enrollment);

	public boolean deleteEnrollment(Long id);
}
