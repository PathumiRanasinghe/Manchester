package com.university.controller;

import com.university.dto.EnrollmentDto;
import com.university.mapper.EnrollmentMapper;
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
public class EnrollmenController {

    @Inject
    private EnrollmentService enrollmentService;

    @GET
    @RolesAllowed({"admin","student", "lecturer"})
    public List<EnrollmentDto> getEnrollments() {
        List<Enrollment> enrollments = enrollmentService.getAllEnrollments();
        return enrollments.stream().map(EnrollmentMapper::toDto).toList();
    }

    @GET
    @RolesAllowed({"admin", "student", "lecturer"})
    @Path("/{id}")
    public Response getEnrollmentById(@PathParam("id") Long id) {
        Enrollment enrollment = enrollmentService.getEnrollmentById(id);
        if (enrollment == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Enrollment not found").build();
        }
        return Response.ok(EnrollmentMapper.toDto(enrollment)).build();
    }

    @POST
    @RolesAllowed({"student"})
    public Response createEnrollment(EnrollmentDto enrollmentDto) {
        Enrollment enrollment = EnrollmentMapper.toEntity(enrollmentDto);
        Enrollment created = enrollmentService.createEnrollment(enrollment);
        return Response.status(Response.Status.CREATED).entity(EnrollmentMapper.toDto(created)).build();
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
