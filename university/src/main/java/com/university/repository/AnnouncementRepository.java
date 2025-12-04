
package com.university.repository;

import com.university.entity.Announcement;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AnnouncementRepository {
        public List<Announcement> findByLecturerId(Long lecturerId) {
            return em.createQuery("SELECT a FROM Announcement a WHERE a.lecturer.lecturerId = :lecturerId ORDER BY a.postedAt DESC", Announcement.class)
                    .setParameter("lecturerId", lecturerId)
                    .getResultList();
        }
    @PersistenceContext
    EntityManager em;

    public List<Announcement> findAll() {
        return em.createQuery("SELECT a FROM Announcement a ORDER BY a.postedAt DESC", Announcement.class)
                .getResultList();
    }

    @Transactional
    public void save(Announcement announcement) {
        em.persist(announcement);
    }

    @Transactional
    public void deleteById(Long id) {
        Announcement announcement = em.find(Announcement.class, id);
        if (announcement != null) {
            em.remove(announcement);
        }
    }
}
