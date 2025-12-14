
package com.university.repository;

import java.util.List;

import com.university.entity.Student;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class StudentRepository implements PanacheRepository<Student> {
	public Student findByEmail(String email) {
		return find("email", email).firstResult();
	}

	public List<Student> findPaged(int page, int pageSize) {
		return findAll().page(page - 1, pageSize).list();
	}

	public long countAll() {
		return count();
	}
}
