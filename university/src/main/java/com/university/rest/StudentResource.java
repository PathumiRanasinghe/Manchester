
package com.university.rest;

import java.util.List;
import com.university.entity.Student;
import com.university.service.StudentService;
import jakarta.inject.Inject;
import org.eclipse.microprofile.jwt.JsonWebToken;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;


@Path("/api/students")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class StudentResource {
    @Inject
    StudentService studentService;

    @Inject
    JsonWebToken jwt;

    @GET
    @Path("/by-email")
    public Response getStudentByEmail(@jakarta.ws.rs.QueryParam("email") String email) {
        try {
            Student student = studentService.getStudentByEmail(email);
            return Response.ok(student).build();
        } catch (Exception e) {
            return Response.status(Response.Status.NOT_FOUND).entity("Student not found").build();
        }
    }

    @GET
    public List<Student> getStudents() {
        return studentService.getAllStudents();
    }

    @GET
    @Path("/{id}/modules")
    public List<com.university.entity.Module> getModulesForStudent(@PathParam("id") Integer id) {
        return studentService.getModulesForStudent(id);
    }

    @GET
    @Path("/{id}")
    public Student getStudent(@PathParam("id") Long id) {
        return studentService.getStudentById(id);
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateStudent(@PathParam("id") Long id, Student updatedStudent) {
        Student student = studentService.updateStudent(id, updatedStudent);
        if (student == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(student).build();
    }

}
