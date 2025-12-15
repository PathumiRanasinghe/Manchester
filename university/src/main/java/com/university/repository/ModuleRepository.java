
package com.university.repository;

import java.util.List;
import com.university.entity.Module;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ModuleRepository implements PanacheRepository<Module> {
	public List<Module> findPaged(int page, int pageSize) {
		return findAll().page(page - 1, pageSize).list();
	}
		public long countAll() {
		return count();
	}
}
