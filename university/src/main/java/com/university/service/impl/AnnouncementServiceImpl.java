package com.university.service.impl;

import com.university.dto.AnnouncementDto;
import com.university.mapper.AnnouncementMapper;
import com.university.entity.Lecturer;
import com.university.entity.Department;
import jakarta.ws.rs.core.Response;
import com.university.entity.Announcement;
import com.university.repository.AnnouncementRepository;
import com.university.repository.LecturerRepository;
import com.university.service.AnnouncementService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class AnnouncementServiceImpl implements AnnouncementService{
    @Inject
    private AnnouncementRepository announcementRepository;

    @Inject
    private LecturerRepository lecturerRepository;

     public Response getAnnouncementsByLecturerIdResponse(Long lecturerId) {
        List<Announcement> announcements = announcementRepository.findByLecturerId(lecturerId);
        if (announcements == null || announcements.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).entity("No announcements found").build();
        }
        return Response.ok(announcements.stream().map(AnnouncementMapper::toDto).toList()).build();
    }

    public Response getAnnouncementsByDepartmentIdResponse(Long departmentId) {
        List<Announcement> announcements = announcementRepository.findByDepartmentId(departmentId);
        if (announcements == null || announcements.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).entity("No announcements found").build();
        }
        return Response.ok(announcements.stream().map(AnnouncementMapper::toDto).toList()).build();
    }

    @Transactional
    public Response postAnnouncementResponse(AnnouncementDto announcementDto) {
        Long departmentId = announcementDto.getDepartmentId();
        Lecturer lecturer = null;
        if (announcementDto.getLecturerId() != null) {
            lecturer = lecturerRepository.findById(announcementDto.getLecturerId());
            if (lecturer == null) {
                return Response.status(Response.Status.NOT_FOUND)
                    .entity("Lecturer not found. Cannot post announcement.").build();
            }
            if (departmentId == null && lecturer.getDepartment() != null) {
                departmentId = lecturer.getDepartment().getDepartmentId();
            }
        }
        if (departmentId == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity("Department ID is required for announcement").build();
        }
        Department department = lecturer != null ? lecturer.getDepartment() : null;
        Announcement announcement = AnnouncementMapper.toEntity(announcementDto, lecturer, department);
        announcementRepository.persist(announcement);
        return Response.ok().build();
    }

    @Transactional
    public Response deleteAnnouncementResponse(Long id) {
        announcementRepository.deleteById(id);
        return Response.ok().build();
    }
}
