package com.university.rest;

import java.util.List;
import com.university.entity.Department;
import com.university.entity.Lecturer;
import com.university.service.DepartmentService;
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
public class LecturerResource {
    @Inject
    private LecturerService lecturerService;

    @Inject
    private DepartmentService departmentService;


    @GET
    @Path("/lecturers")
    @RolesAllowed({ "admin" })
    public List<Lecturer> getLecturers() {
        return lecturerService.getAllLecturers();
    }

    @GET
    @Path("/lecturers/{id}")
    @RolesAllowed({ "admin", "lecturer", "student" })
    public Lecturer getLecturer(@PathParam("id") Long id) {
        return lecturerService.getLecturerById(id);
    }

    @GET
    @RolesAllowed({ "admin", "lecturer" })
    @Path("/lecturers/by-email")
    public Response getLecturerByEmail(@QueryParam("email") String email) {
        try {
            Lecturer lecturer = lecturerService.getLecturerByEmail(email);
            return Response.ok(lecturer).build();
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
            Lecturer lecturer = lecturerService.getAllLecturers().stream()
                    .filter(l -> l.getLecturerId().equals(id.intValue()))
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
    public Response createLecturer(jakarta.json.JsonObject json) {
        try {
            if (!json.containsKey("departmentId") || json.isNull("departmentId")) {
                return Response.status(Response.Status.BAD_REQUEST).entity("departmentId is required").build();
            }
            Long departmentId = json.getJsonNumber("departmentId").longValue();
            Department department = departmentService.getDepartmentById(departmentId);
            if (department == null) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Invalid departmentId").build();
            }
            Lecturer lecturer = new Lecturer();
            lecturer.setFirstName(json.getString("firstName", null));
            lecturer.setLastName(json.getString("lastName", null));
            lecturer.setEmail(json.getString("email", null));
            lecturer.setPassword(json.getString("password", null));
            lecturer.setDepartment(department);

            Lecturer created = lecturerService.createLecturer(lecturer);
            return Response.status(Response.Status.CREATED).entity(created).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Failed to create lecturer: " + e.getMessage())
                    .build();
        }
    }

}
