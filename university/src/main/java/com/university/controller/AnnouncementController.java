package com.university.controller;

import com.university.dto.AnnouncementDto;
import com.university.service.AnnouncementService;
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

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AnnouncementController {
	@Inject
	private AnnouncementService announcementService;
	
	@GET
	@RolesAllowed({ "lecturer"})
	@Path("/lecturers/{lecturerId}/announcements")
	public Response getAnnouncementsByLecturerId(@PathParam("lecturerId") Long lecturerId) {
		return announcementService.getAnnouncementsByLecturerIdResponse(lecturerId);
	}

	@POST
	@RolesAllowed("lecturer")
	@Path("/announcements")
	public Response postAnnouncement(AnnouncementDto announcementDto) {
		return announcementService.postAnnouncementResponse(announcementDto);
	}

	@GET
	@RolesAllowed({  "student" })
	@Path("/departments/{departmentId}/announcements")
	public Response getAnnouncementsByDepartmentId(@PathParam("departmentId") Long departmentId) {
		return announcementService.getAnnouncementsByDepartmentIdResponse(departmentId);
	}
	
	@DELETE
	@RolesAllowed("lecturer")
	@Path("/announcements/{id}")
	public Response deleteAnnouncement(@PathParam("id") Long id) {
		return announcementService.deleteAnnouncementResponse(id);
	}
	
}