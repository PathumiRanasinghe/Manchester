package com.university.controller;

import com.university.dto.LecturerDto;
import com.university.dto.PaginatedResponse;
import com.university.service.LecturerService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.QueryParam;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class Lecturercontroller {
    @Inject
    private LecturerService lecturerService;

    @GET
    @RolesAllowed({ "admin" })
    @Path("/lecturers/count")
    public Response getLecturerCount() {
        long count = lecturerService.getAllLecturers(1, 1).getTotal();
        return Response.ok(count).build();
    }

    @GET
    @Path("/lecturers")
    @RolesAllowed({ "admin" })
    public PaginatedResponse<LecturerDto> getLecturers(@QueryParam("page") Integer page,
            @QueryParam("pageSize") Integer pageSize) {
        return lecturerService.getAllLecturers(page, pageSize);
    }

    @GET
    @Path("/departments/{departmentId}/lecturers")
    @RolesAllowed({ "admin" })
    public Response getLecturersByDepartmentId(@PathParam("departmentId") Long departmentId) {
        return lecturerService.getLecturersByDepartmentId(departmentId);
    }

    @GET
    @Path("/lecturers/{id}")
    @RolesAllowed({ "admin", "lecturer", "student" })
    public Response getLecturerById(@PathParam("id") Long id) {
        return lecturerService.getLecturerByIdResponse(id);
    }

    @GET
    @RolesAllowed({ "admin", "lecturer" })
    @Path("/lecturers/by-email")
    public Response getLecturerByEmail(@QueryParam("email") String email) {
        return lecturerService.getLecturerByEmailResponse(email);
    }

    @DELETE
    @Path("/lecturers/{id}")
    @RolesAllowed("admin")
    public Response deleteLecturer(@PathParam("id") Long id) {
        return lecturerService.deleteLecturerResponse(id);
    }

    @POST
    @Path("/lecturers")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createLecturer(@Valid LecturerDto lecturerDto) {
        return lecturerService.createLecturerResponse(lecturerDto);
    }

}
