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

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public void postAnnouncement(Announcement announcement) {
        announcementRepository.save(announcement);
    }
    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
}
