package com.university.service;

import java.util.List;
import com.university.entity.Announcement;

public interface AnnouncementService {
    public void postAnnouncement(Announcement announcement);
    public void deleteAnnouncement(Long id);
    public List<Announcement> getAnnouncementsByLecturerId(Long lecturerId);
    public List<Announcement> getAnnouncementsByDepartmentId(Long departmentId);
}
