
package com.university.repository;

import java.util.List;

import com.university.entity.Department;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class DeparmentRepository implements PanacheRepository<Department> {
    public List<Department> findPaged(int page, int pageSize) {
        return findAll().page(page - 1, pageSize).list();
    }

    public long countAll() {
        return count();
    }
}
