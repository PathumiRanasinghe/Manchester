
package com.university.repository;

import com.university.entity.Admin;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AdminRepository implements PanacheRepository<Admin>{
	public Admin findByEmail(String email) {
		return find("email", email).firstResult();
	}
}
