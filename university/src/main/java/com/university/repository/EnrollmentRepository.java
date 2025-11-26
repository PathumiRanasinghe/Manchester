package com.university.repository;

import com.university.entity.Enrollment;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EnrollmentRepository implements PanacheRepository<Enrollment> {
    // Custom queries can be added here
}
