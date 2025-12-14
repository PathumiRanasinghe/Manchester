package com.university.repository;

import com.university.entity.Enrollment;
import java.util.List;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EnrollmentRepository implements PanacheRepository<Enrollment> {
	public List<Enrollment> findPaged(int page, int pageSize) {
		return findAll().page(page - 1, pageSize).list();
	}

	public long countAll() {
		return count();
	}

	public List<Enrollment> findByStudentId(Long studentId) {
		return list("student.studentId", studentId);
	}
}
