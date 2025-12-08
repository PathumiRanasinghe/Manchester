package com.university.rest;

import java.util.List;
import com.university.entity.Student;
import com.university.entity.Module;
import com.university.service.StudentService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.QueryParam;

@Path("/api/students")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class StudentResource {
    @Inject
    StudentService studentService;

    @GET
    @RolesAllowed({ "admin" })
    public List<Student> getStudents() {
        return studentService.getAllStudents();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({ "admin", "student" })
    public Student getStudent(@PathParam("id") Long id) {
        return studentService.getStudentById(id);
    }

    @GET
    @RolesAllowed({ "admin", "student" })
    @Path("/by-email")
    public Response getStudentByEmail(@QueryParam("email") String email) {
        try {
            Student student = studentService.getStudentByEmail(email);
            return Response.ok(student).build();
        } catch (Exception e) {
            return Response.status(Response.Status.NOT_FOUND).entity("Student not found").build();
        }
    }

    @GET
    @RolesAllowed({ "admin", "student" })
    @Path("/{id}/modules")
    public List<Module> getModulesForStudent(@PathParam("id") Integer id) {
        return studentService.getModulesForStudent(id);
    }

}
