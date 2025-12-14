package com.university.controller;

import com.university.dto.EnrollmentDto;
import com.university.mapper.EnrollmentMapper;
import jakarta.ws.rs.QueryParam;
import com.university.dto.PaginatedResponse;
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

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EnrollmenController {

    @Inject
    private EnrollmentService enrollmentService;

    @GET
    @RolesAllowed({ "admin", "student", "lecturer" })
    @Path("/enrollments")
    public Response getEnrollments(@QueryParam("page") Integer page,@QueryParam("pageSize") Integer pageSize) {
        PaginatedResponse<EnrollmentDto> response = enrollmentService.getEnrollmentsPagedDto(page, pageSize);
        return Response.ok(response).build();
    }

    @GET
    @RolesAllowed({ "admin", "student", "lecturer" })
    @Path("/enrollments/{id}")
    public Response getEnrollmentById(@PathParam("id") Long id) {
        Enrollment enrollment = enrollmentService.getEnrollmentById(id);
        if (enrollment == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Enrollment not found").build();
        }
        return Response.ok(EnrollmentMapper.toDto(enrollment)).build();
    }

    @GET
    @RolesAllowed({ "student" })
    @Path("students/{studentId}/enrollments")
    public Response getEnrollmentsByStudentId(@PathParam("studentId") Long studentId) {
        PaginatedResponse<EnrollmentDto> response = enrollmentService.getEnrollmentsByStudentId(studentId);
        return Response.ok(response).build();
    }

    @POST
    @RolesAllowed({ "student" })
    @Path("/enrollments")
    public Response createEnrollment(EnrollmentDto enrollmentDto) {
        Enrollment enrollment = EnrollmentMapper.toEntity(enrollmentDto);
        Enrollment created = enrollmentService.createEnrollment(enrollment);
        return Response.status(Response.Status.CREATED).entity(EnrollmentMapper.toDto(created)).build();
    }

    @DELETE
    @RolesAllowed({ "admin", "student" })
    @Path("/enrollments/{id}")
    public Response deleteEnrollment(@PathParam("id") Long id) {
        boolean deleted = enrollmentService.deleteEnrollment(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}
