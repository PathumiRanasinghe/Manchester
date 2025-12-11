package com.university.mapper;

import com.university.dto.AnnouncementDto;
import com.university.entity.Announcement;
import com.university.entity.Lecturer;
import com.university.entity.Department;
import java.time.LocalDateTime;

public class AnnouncementMapper {
    public static Announcement toEntity(AnnouncementDto dto, Lecturer lecturer, Department department) {
        if (dto == null)
            return null;
        Announcement announcement = new Announcement();
        announcement.setId(dto.getId());
        announcement.setTitle(dto.getTitle());
        announcement.setContent(dto.getContent());
        announcement.setLecturer(lecturer);
        announcement.setPostedAt(dto.getPostedAt());
        return announcement;
    }

    public static AnnouncementDto toDto(Announcement announcement) {
        if (announcement == null)
            return null;
        Long lecturerId = announcement.getLecturer() != null ? announcement.getLecturer().getLecturerId() : null;
        Long departmentId = announcement.getLecturer().getDepartment().getDepartmentId() != null
                ? announcement.getLecturer().getDepartment().getDepartmentId()
                : null;
        LocalDateTime postedAt = announcement.getPostedAt();
        return new AnnouncementDto(
                announcement.getId(),
                announcement.getTitle(),
                announcement.getContent(),
                lecturerId,
                departmentId,
                postedAt);
    }
}
