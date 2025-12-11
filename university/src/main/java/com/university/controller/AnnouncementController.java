package com.university.controller;

import com.university.dto.AnnouncementDto;
import com.university.mapper.AnnouncementMapper;
import com.university.entity.Announcement;
import com.university.entity.Department;
import com.university.entity.Lecturer;
import com.university.service.AnnouncementService;
import com.university.service.DepartmentService;
import com.university.service.LecturerService;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.MediaType;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import java.util.List;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AnnouncementController {
	@Inject
	private AnnouncementService announcementService;

	@Inject 
	private LecturerService lecturerService;

	@Inject
	private DepartmentService departmentService;
	
	@GET
	@RolesAllowed({ "lecturer"})
	@Path("/lecturers/{lecturerId}/announcements")
	public List<AnnouncementDto> getAnnouncementsByLecturerId(@PathParam("lecturerId") Long lecturerId) {
		List<Announcement> announcements = announcementService.getAnnouncementsByLecturerId(lecturerId);
		return announcements.stream().map(AnnouncementMapper::toDto).toList();
	}

	@POST
	@RolesAllowed("lecturer")
	@Path("/announcements")
	public Response postAnnouncement(AnnouncementDto announcementDto) {
		Long departmentId = announcementDto.getDepartmentId();
		if (departmentId == null && announcementDto.getLecturerId() != null) {
			Lecturer lecturer = lecturerService.getLecturerById(announcementDto.getLecturerId());
			if (lecturer != null && lecturer.getDepartment() != null) {
				departmentId = lecturer.getDepartment().getDepartmentId();
			}
		}
		if (departmentId == null) {
			return Response.status(Response.Status.BAD_REQUEST)
				.entity("Department ID is required for announcement").build();
		}
		Lecturer lecturer = lecturerService.getLecturerById(announcementDto.getLecturerId());
		Department department = departmentService.getDepartmentById(departmentId);
		Announcement announcement = AnnouncementMapper.toEntity(announcementDto, lecturer, department);
		announcementService.postAnnouncement(announcement);
		return jakarta.ws.rs.core.Response.ok().build();
	}

	@GET
	@RolesAllowed({  "student" })
	@Path("/departments/{departmentId}/announcements")
	public List<AnnouncementDto> getAnnouncementsByDepartmentId(@PathParam("departmentId") Long departmentId) {
		List<Announcement> announcements = announcementService.getAnnouncementsByDepartmentId(departmentId);
		return announcements.stream().map(AnnouncementMapper::toDto).toList();
	}
	
	@DELETE
	@RolesAllowed("lecturer")
	@Path("/announcements/{id}")
	public void deleteAnnouncement(@PathParam("id") Long id) {
		announcementService.deleteAnnouncement(id);
	}
	
}