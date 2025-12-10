package com.university.rest;

import java.util.List;
import com.university.entity.Department;
import com.university.entity.Student;
import com.university.service.DepartmentService;
import com.university.service.StudentService;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
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
public class StudentResource {
    @Inject
    private StudentService studentService;

    @Inject
    private DepartmentService departmentService;

    @GET
    @Path("/students")  
    @RolesAllowed({ "admin" })
    public List<Student> getStudents() {
        return studentService.getAllStudents();
    }

    @GET
    @Path("/students/{id}")
    @RolesAllowed({ "admin", "student" })
    public Student getStudent(@PathParam("id") Long id) {
        return studentService.getStudentById(id);
    }

    @GET
    @RolesAllowed({ "admin", "student" })
    @Path("/students/by-email")
    public Response getStudentByEmail(@QueryParam("email") String email) {
        studentService.getStudentByEmail(email);
        try {
            Student student = studentService.getStudentByEmail(email);
            return Response.ok(student).build();
        } catch (Exception e) {
            return Response.status(Response.Status.NOT_FOUND).entity("Student not found").build();
        }
    }

    @DELETE
    @Path("/students/{id}")
    public Response deleteStudent(@PathParam("id") Long id) {
        boolean deleted = studentService.deleteStudent(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity("Student not found").build();
        }
    }

    @GET
    @RolesAllowed({"admin", "lecturer"})
    @Path("/modules/{id}/students")
    public List<Student> getStudentsByModuleId(@PathParam("id") Integer id) {
        return studentService.getStudentsByModuleId(id);
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

            Student created = studentService.createStudent(student);
            return Response.status(Response.Status.CREATED).entity(created).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Failed to create student: " + e.getMessage())
                    .build();
        }
    }


}
