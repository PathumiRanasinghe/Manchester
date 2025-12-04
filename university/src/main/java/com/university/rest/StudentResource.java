package com.university.rest;

import java.util.List;

import com.university.entity.Student;
import com.university.service.StudentService;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
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

    @GET
    public List<Student> getStudents() {
        return studentService.getAllStudents();
    }

    /// there is a duplicate like this in the module also, so check it!!!!!
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

    @POST
    @Transactional
    public Response createStudent(Student student) {
        Student created = studentService.createStudent(student);
        return Response.status(Response.Status.CREATED).entity(created).build();
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

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteStudent(@PathParam("id") Long id) {
        boolean deleted = studentService.deleteStudent(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

}
