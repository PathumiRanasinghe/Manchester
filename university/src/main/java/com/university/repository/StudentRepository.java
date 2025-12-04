package com.university.repository;

import com.university.entity.Student;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class StudentRepository implements PanacheRepository<Student> {
	public Student findByEmail(String email) {
		return find("email", email).firstResult();
	}
}
