package com.university.service.impl;

import com.university.entity.Announcement;
import com.university.repository.AnnouncementRepository;
import com.university.service.AnnouncementService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class AnnouncementServiceImpl implements AnnouncementService{
    @Inject
    private AnnouncementRepository announcementRepository;

    public List<Announcement> getAnnouncementsByLecturerId(Long lecturerId) {
        return announcementRepository.findByLecturerId(lecturerId);
    }

    @Transactional
    public void postAnnouncement(Announcement announcement) {
        announcementRepository.persist(announcement);
    }
    
    @Transactional
    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }

    public List<Announcement> getAnnouncementsByDepartmentId(Long departmentId) {
        return announcementRepository.findByDepartmentId(departmentId);
    }
}
