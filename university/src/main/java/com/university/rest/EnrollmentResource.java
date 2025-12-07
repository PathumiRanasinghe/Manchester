package com.university.rest;

import java.util.List;
import com.university.entity.Enrollment;
import com.university.service.EnrollmentService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/enrollments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EnrollmentResource {

    @Inject
    EnrollmentService enrollmentService;

    @GET
    @RolesAllowed({"admin","student", "lecturer"})
    public List<Enrollment> getEnrollments() {
        return enrollmentService.getAllEnrollments();
    }

    @GET
    @RolesAllowed({"admin", "student", "lecturer"})
    @Path("/{id}")
    public Enrollment getEnrollmentById(@PathParam("id") Long id) {
        return enrollmentService.getEnrollmentById(id);
    }

    @POST
    @RolesAllowed({"student"})
    public Response createEnrollment(Enrollment enrollment) {
        Enrollment created = enrollmentService.createEnrollment(enrollment);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @DELETE
    @RolesAllowed({"admin", "student"})
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
