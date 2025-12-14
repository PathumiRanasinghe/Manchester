package com.university.controller;

import com.university.dto.LecturerDto;
import com.university.dto.PaginatedResponse;
import com.university.mapper.LecturerMapper;
import java.util.List;
import com.university.entity.Lecturer;
import com.university.exception.DuplicateEmailException;
import com.university.service.LecturerService;
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
    public List<LecturerDto> getLecturersByDepartmentId(@PathParam("departmentId") Long departmentId) {
        List<Lecturer> lecturers = lecturerService.getLecturersByDepartmentId(departmentId);
        return lecturers.stream().map(LecturerMapper::toDto).toList();
    }

    @GET
    @Path("/lecturers/{id}")
    @RolesAllowed({ "admin", "lecturer", "student" })
    public Response getLecturer(@PathParam("id") Long id) {
        Lecturer lecturer = lecturerService.getLecturerById(id);
        if (lecturer == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Lecturer not found").build();
        }
        return Response.ok(LecturerMapper.toDto(lecturer)).build();
    }

    @GET
    @RolesAllowed({ "admin", "lecturer" })
    @Path("/lecturers/by-email")
    public Response getLecturerByEmail(@QueryParam("email") String email) {
        try {
            Lecturer lecturer = lecturerService.getLecturerByEmail(email);
            if (lecturer == null) {
                return Response.status(Response.Status.NOT_FOUND).entity("Lecturer not found").build();
            }
            return Response.ok(LecturerMapper.toDto(lecturer)).build();
        } catch (Exception e) {
            return Response.status(Response.Status.NOT_FOUND).entity("Lecturer not found").build();
        }
    }

    @DELETE
    @Path("/lecturers/{id}")
    @RolesAllowed("admin")
    public Response deleteLecturer(@PathParam("id") Long id) {
        boolean deleted = lecturerService.deleteLecturer(id);
        if (deleted) {
            return Response.noContent().build();
        } else {

            var response = lecturerService.getAllLecturers(1, 10);
            LecturerDto lecturer = response.getItems().stream()
                    .filter(l -> l.getLecturerId().equals(id.longValue()))
                    .findFirst().orElse(null);
            if (lecturer != null) {
                return Response.status(Response.Status.CONFLICT)
                        .entity("Cannot delete lecturer: modules are assigned. Please reassign those modules to another lecturer before deleting.")
                        .build();
            }
            return Response.status(Response.Status.NOT_FOUND).entity("Lecturer not found").build();
        }
    }

    @POST
    @Path("/lecturers")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createLecturer(LecturerDto lecturerDto) {
        Lecturer lecturer = LecturerMapper.toEntity(lecturerDto);
        try{
            Lecturer created = lecturerService.createLecturer(lecturer);
            return Response.status(Response.Status.CREATED).entity(LecturerMapper.toDto(created)).build();
        } catch(DuplicateEmailException e){
            return Response.status(Response.Status.CONFLICT).entity(e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Failed to create lecturer: " + e.getMessage()).build();
        }
    }

}
