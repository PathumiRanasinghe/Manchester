package com.university.rest;

import java.util.List;
import com.university.entity.Lecturer;
import com.university.service.LecturerService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.QueryParam;

@Path("/api/lecturers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LecturerResource {
    @Inject
    LecturerService lecturerService;

    @GET
    @RolesAllowed({"admin"})
    public List<Lecturer> getLecturers() {
        return lecturerService.getAllLecturers();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"admin", "lecturer", "student"})
    public Lecturer getLecturer(@PathParam("id") Long id) {
        return lecturerService.getLecturerById(id);
    }
    @GET
    @RolesAllowed({"admin", "lecturer"})
    @Path("/by-email")
    public Response getLecturerByEmail(@QueryParam("email") String email) {
        try {
            Lecturer lecturer = lecturerService.getLecturerByEmail(email);
            return Response.ok(lecturer).build();
        } catch (Exception e) {
            return Response.status(Response.Status.NOT_FOUND).entity("Lecturer not found").build();
        }
    }


}

