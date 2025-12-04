
package com.university.controller;

import java.util.List;
import com.university.entity.Enrollment;
import com.university.service.EnrollmentService;
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

@Path("/enrollments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EnrollmentController {

    @Inject
    EnrollmentService enrollmentService;

    @GET
    public List<Enrollment> getEnrollments() {
        return enrollmentService.getAllEnrollments();
    }

    @GET
    @Path("/{id}")
    public Enrollment getEnrollment(@PathParam("id") Long id) {
        return enrollmentService.getEnrollmentById(id);
    }

    @POST
    public Response createEnrollment(Enrollment enrollment) {
        Enrollment created = enrollmentService.createEnrollment(enrollment);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateEnrollment(@PathParam("id") Long id, Enrollment updatedEnrollment) {
        Enrollment enrollment = enrollmentService.updateEnrollment(id, updatedEnrollment);
        if (enrollment == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(enrollment).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteEnrollment(@PathParam("id") Long id) {
        boolean deleted = enrollmentService.deleteEnrollment(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}
