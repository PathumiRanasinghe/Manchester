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

@Path("/api/announcements")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AnnouncementResource {
	@Inject
	AnnouncementService announcementService;
	
	@GET
	@RolesAllowed({ "lecturer"})
	@Path("/lecturer/{lecturerId}")
	public List<Announcement> getAnnouncementsByLecturerId(@PathParam("lecturerId") Long lecturerId) {
		return announcementService.getAnnouncementsByLecturerId(lecturerId);
	}

	@GET
	@RolesAllowed({ "lecturer","student"})
	public List<Announcement> getAllAnnouncements() {
		return announcementService.getAllAnnouncements();
	}

	@POST
	@RolesAllowed("lecturer")
	public void postAnnouncement(Announcement announcement) {
		announcementService.postAnnouncement(announcement);
	}
	@DELETE
	@RolesAllowed("lecturer")
	@Path("/{id}")
	public void deleteAnnouncement(@PathParam("id") Long id) {
		announcementService.deleteAnnouncement(id);
	}
}