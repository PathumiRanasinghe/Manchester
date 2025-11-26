package com.university.repository;

import com.university.entity.Subject;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SubjectRepository implements PanacheRepository<Subject> {
    // Custom queries can be added here
}
