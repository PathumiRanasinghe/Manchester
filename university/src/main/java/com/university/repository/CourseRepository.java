package com.university.repository;

import com.university.entity.Course;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CourseRepository implements PanacheRepository<Course> {
    // Custom queries can be added here
}
