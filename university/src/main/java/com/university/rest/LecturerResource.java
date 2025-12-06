package com.university.rest;

import java.util.List;
import org.eclipse.microprofile.jwt.JsonWebToken;
import com.university.entity.Lecturer;
import com.university.service.LecturerService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/lecturers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LecturerResource {
    @Inject
    LecturerService lecturerService;

    @Inject
    JsonWebToken jwt;

    @GET
    @Path("/by-email")
    public Response getLecturerByEmail(@jakarta.ws.rs.QueryParam("email") String email) {
        try {
            Lecturer lecturer = lecturerService.getLecturerByEmail(email);
            return Response.ok(lecturer).build();
        } catch (Exception e) {
            return Response.status(Response.Status.NOT_FOUND).entity("Lecturer not found").build();
        }
    }

    @GET
    public List<Lecturer> getLecturers() {
        return lecturerService.getAllLecturers();
    }

    @GET
    @Path("/{id}")
    public Lecturer getLecturer(@PathParam("id") Long id) {
        return lecturerService.getLecturerById(id);
    }

    @PUT
    @Path("/{id}")
    public Response updateLecturer(@PathParam("id") Long id, Lecturer updatedLecturer) {
        Lecturer lecturer = lecturerService.updateLecturer(id, updatedLecturer);
        if (lecturer == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(lecturer).build();
    }

}

