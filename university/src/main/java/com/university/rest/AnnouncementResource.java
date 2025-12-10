package com.university.rest;

import com.university.entity.Announcement;
import com.university.service.AnnouncementService;

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
public class AnnouncementResource {
	@Inject
	private AnnouncementService announcementService;
	
	@GET
	@RolesAllowed({ "lecturer"})
	@Path("/lecturers/{lecturerId}/announcements")
	public List<Announcement> getAnnouncementsByLecturerId(@PathParam("lecturerId") Long lecturerId) {
		return announcementService.getAnnouncementsByLecturerId(lecturerId);
	}

	@POST
	@RolesAllowed("lecturer")
	@Path("/announcements")
	public void postAnnouncement(Announcement announcement) {
		announcementService.postAnnouncement(announcement);
	}
	@DELETE
	@RolesAllowed("lecturer")
	@Path("/announcements/{id}")
	public void deleteAnnouncement(@PathParam("id") Long id) {
		announcementService.deleteAnnouncement(id);
	}
	
	@GET
	@RolesAllowed({  "student" })
	@Path("/departments/{departmentId}/announcements")
	public List<Announcement> getAnnouncementsByDepartmentId(@PathParam("departmentId") Long departmentId) {
		return announcementService.getAnnouncementsByDepartmentId(departmentId);
	}
}