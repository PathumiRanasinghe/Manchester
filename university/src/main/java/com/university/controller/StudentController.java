package com.university.controller;

import com.university.dto.PaginatedResponse;
import com.university.dto.StudentDto;
import com.university.mapper.StudentMapper;
import java.util.List;
import com.university.entity.Student;
import com.university.exception.DuplicateEmailException;
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
        Student student = StudentMapper.toEntity(studentDto);
        try {
            Student created = studentService.createStudent(student);
            return Response.status(Response.Status.CREATED).entity(StudentMapper.toDto(created)).build();
        } catch (DuplicateEmailException e) {
            return Response.status(Response.Status.CONFLICT).entity(e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR) .entity("Failed to create student: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/students/{id}")
    @RolesAllowed({ "admin", "student" })
    public Response getStudent(@PathParam("id") Long id) {
        Student student = studentService.getStudentById(id);
        if (student == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Student not found").build();
        }
        return Response.ok(StudentMapper.toDto(student)).build();
    }

    @GET
    @RolesAllowed({ "admin", "student" })
    @Path("/students/by-email")
    public Response getStudentByEmail(@QueryParam("email") String email) {
        try {
            Student student = studentService.getStudentByEmail(email);
            if (student == null) {
                return Response.status(Response.Status.NOT_FOUND).entity("Student not found").build();
            }
            return Response.ok(StudentMapper.toDto(student)).build();
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
    @RolesAllowed({ "admin", "lecturer" })
    @Path("/modules/{id}/students")
    public List<StudentDto> getStudentsByModuleId(@PathParam("id") Integer id) {
        List<Student> students = studentService.getStudentsByModuleId(id);
        return students.stream()
                .map(StudentMapper::toDto)
                .toList();
    }

    @GET
    @Path("/students/{id}/modules")
    @RolesAllowed({ "admin", "student" })
    public Response getModulesByStudentId(@PathParam("id") Long id) {
        List<com.university.entity.Module> modules = studentService.getModulesByStudentId(id);
        List<com.university.dto.ModuleDto> moduleDtos = modules.stream()
                .map(com.university.mapper.ModuleMapper::toDto)
                .toList();
        return Response.ok(moduleDtos).build();
    }

}
