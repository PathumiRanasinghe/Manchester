package com.university.repository;

import com.university.entity.Announcement;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AnnouncementRepository implements PanacheRepository<Announcement> {
    @PersistenceContext
    EntityManager em;

    public List<Announcement> findByLecturerId(Long lecturerId) {
        return find("lecturer.lecturerId = ?1 ORDER BY postedAt DESC", lecturerId).list();
    }

    public List<Announcement> findByDepartmentId(Long departmentId) {
        return find("lecturer.department.departmentId = ?1 ORDER BY postedAt DESC", departmentId).list();
    }
}
