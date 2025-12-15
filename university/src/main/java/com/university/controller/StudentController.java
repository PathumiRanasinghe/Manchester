package com.university.controller;

import com.university.dto.PaginatedResponse;
import com.university.dto.StudentDto;
import com.university.service.StudentService;
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
public class StudentController {
    @Inject
    private StudentService studentService;

    @GET
    @RolesAllowed({ "admin" })
    @Path("/students/count")
    public Response getStudentCount() {
        long count = studentService.getAllStudents(1, 1).getTotal();
        return Response.ok(count).build();
    }

    @GET
    @Path("/students")
    @RolesAllowed({ "admin" })
    public PaginatedResponse<StudentDto> getStudents(@QueryParam("page") Integer page,
            @QueryParam("pageSize") Integer pageSize) {
        return studentService.getAllStudents(page, pageSize);
    }

    @POST
    @Path("/students")
    @RolesAllowed({ "admin" })
    public Response createStudent(StudentDto studentDto) {
        return studentService.createStudentResponse(studentDto);
    }

    @GET
    @Path("/students/{id}")
    @RolesAllowed({ "admin", "student" })
    public Response getStudentById(@PathParam("id") Long id) {
        return studentService.getStudentByIdResponse(id);
    }

    @GET
    @RolesAllowed({ "admin", "student" })
    @Path("/students/by-email")
    public Response getStudentByEmail(@QueryParam("email") String email) {
        return studentService.getStudentByEmailResponse(email);
    }

    @DELETE
    @Path("/students/{id}")
    public Response deleteStudent(@PathParam("id") Long id) {
        return studentService.deleteStudentResponse(id);
    }

    @GET
    @RolesAllowed({ "admin", "lecturer" })
    @Path("/modules/{id}/students")
    public Response getStudentsByModuleId(@PathParam("id") Integer id) {
        return studentService.getStudentsByModuleIdResponse(id);
       
    }

}
