package com.university.service;

import jakarta.ws.rs.core.Response;
import com.university.dto.AnnouncementDto;

public interface AnnouncementService {

    public Response getAnnouncementsByLecturerIdResponse(Long lecturerId);

    public Response getAnnouncementsByDepartmentIdResponse(Long departmentId);

    public Response postAnnouncementResponse(AnnouncementDto announcementDto);

    public Response deleteAnnouncementResponse(Long id);
}