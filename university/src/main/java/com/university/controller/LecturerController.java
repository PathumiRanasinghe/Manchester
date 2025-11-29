package com.university.controller;

import java.util.List;

import com.university.entity.Lecturer;
import com.university.service.LecturerService;
import jakarta.inject.Inject;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/lecturers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LecturerController {

    @Inject
    LecturerService lecturerService;

    @GET
    public List<Lecturer> getLecturers() {
        return lecturerService.getAllLecturers();
    }

    @GET
    @Path("/{id}")
    public Lecturer getLecturer(@PathParam("id") Long id) {
        return lecturerService.getLecturerById(id);
    }

    @POST
    public Response createLecturer(Lecturer lecturer) {
        Lecturer created = lecturerService.createLecturer(lecturer);
        return Response.status(Response.Status.CREATED).entity(created).build();
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

    @DELETE
    @Path("/{id}")
    public Response deleteLecturer(@PathParam("id") Long id) {
        boolean deleted = lecturerService.deleteLecturer(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}

