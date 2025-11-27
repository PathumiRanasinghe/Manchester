package com.university.repository;

import com.university.entity.Department;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class DeparmentRepository implements PanacheRepository<Department> {
    
}
