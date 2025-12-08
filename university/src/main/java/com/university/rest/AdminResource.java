package com.university.rest;

import com.university.entity.Admin;
import com.university.entity.Lecturer;
import com.university.entity.Student;
import com.university.entity.Department;
import com.university.service.AdminService;
import com.university.service.DepartmentService;
import com.university.service.StudentService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.PathParam;
import jakarta.json.JsonObject;

@Path("/api/admins")
@RolesAllowed("admin")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminResource {

    @Inject
    AdminService adminService;

    @Inject
    DepartmentService departmentService;

    @Inject
    StudentService studentService;
    
    @GET
    @Path("/{id}")
    public Admin getAdminById(Long id) {
        return adminService.getAdminById(id);
    }

    @GET
    @Path("/by-email")
    public Response getAdminByEmail(@QueryParam("email") String email) {
        Admin admin = adminService.getAdminByEmail(email);
        if (admin == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Admin not found").build();
        }
        return Response.ok(admin).build();
    }

    @DELETE
    @Path("/students/{id}")
    public Response deleteStudent(@PathParam("id") Long id) {
        boolean deleted = adminService.deleteStudent(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity("Student not found").build();
        }
    }

    @DELETE
    @Path("/lecturers/{id}")
    public Response deleteLecturer(@PathParam("id") Long id) {
        boolean deleted = adminService.deleteLecturer(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            Lecturer lecturer = adminService.getAllLecturers().stream()
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
    @Path("/students")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createStudent(JsonObject json) {
        try {
            if (!json.containsKey("departmentId") || json.isNull("departmentId")) {
                return Response.status(Response.Status.BAD_REQUEST).entity("departmentId is required").build();
            }
            Long departmentId = json.getJsonNumber("departmentId").longValue();
            Department department = departmentService.getDepartmentById(departmentId);
            if (department == null) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Invalid departmentId").build();
            }
            Student student = new Student();
            student.setFirstName(json.getString("firstName", null));
            student.setLastName(json.getString("lastName", null));
            student.setEmail(json.getString("email", null));
            student.setPassword(json.getString("password", null));
            student.setPhoneNumber(json.getString("phoneNumber", null));
            student.setDepartment(department);

            Student created = adminService.createStudent(student);
            return Response.status(Response.Status.CREATED).entity(created).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Failed to create student: " + e.getMessage())
                    .build();
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

            Lecturer created = adminService.createLecturer(lecturer);
            return Response.status(Response.Status.CREATED).entity(created).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Failed to create lecturer: " + e.getMessage())
                    .build();
        }
    }
}
