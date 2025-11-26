
package com.university.controller;


import java.util.List;

import com.university.entity.Subject;
import com.university.service.SubjectService;
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

@Path("/subjects")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SubjectController {

    @Inject
    SubjectService subjectService;

    @GET
    public List<Subject> getSubjects() {
        return subjectService.getAllSubjects();
    }

    @GET
    @Path("/{id}")
    public Subject getSubject(@PathParam("id") Long id) {
        return subjectService.getSubjectById(id);
    }

    @POST
    public Response createSubject(Subject subject) {
        Subject created = subjectService.createSubject(subject);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateSubject(@PathParam("id") Long id, Subject updatedSubject) {
        Subject subject = subjectService.updateSubject(id, updatedSubject);
        if (subject == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(subject).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteSubject(@PathParam("id") Long id) {
        boolean deleted = subjectService.deleteSubject(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}
