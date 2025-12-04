package com.university.repository;

import com.university.entity.Lecturer;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class LecturerRepository implements PanacheRepository<Lecturer> {
	public Lecturer findByEmail(String email) {
		return find("email", email).firstResult();
	}
}
