package com.university.service;

import com.university.entity.Announcement;
import com.university.repository.AnnouncementRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@ApplicationScoped
public class AnnouncementService {
    @Inject
    AnnouncementRepository announcementRepository;

    public List<Announcement> getAnnouncementsByLecturerId(Long lecturerId) {
        return announcementRepository.findByLecturerId(lecturerId);
    }

    public void postAnnouncement(Announcement announcement) {
        announcementRepository.persist(announcement);
    }
    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }

    public List<Announcement> getAnnouncementsByDepartmentId(Long departmentId) {
        return announcementRepository.findByDepartmentId(departmentId);
    }
}
