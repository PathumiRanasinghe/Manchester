package com.university.repository;

import java.util.List;
import com.university.entity.Lecturer;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class LecturerRepository implements PanacheRepository<Lecturer> {
	public Lecturer findByEmail(String email) {
		return find("email", email).firstResult();
	}

	public List<Lecturer> findByDepartmentId(Long departmentId) {
		return list("department.id", departmentId);
	}

		public List<Lecturer> findPaged(int page, int pageSize) {
		return findAll().page(page - 1, pageSize).list();
	}
	public long countAll() {
		return count();
	}
	
}
