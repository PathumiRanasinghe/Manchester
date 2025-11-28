
package com.university.controller;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.university.entity.Enrollment;
import com.university.entity.Student;
import com.university.service.EnrollmentService;
import com.university.service.ModuleService;
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

@Path("/students")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class StudentController {

    @Inject
    StudentService studentService;

    @Inject
    ModuleService moduleService;

    @Inject
    EnrollmentService enrollmentService;

    @GET
    public List<Student> getStudents() {
        return studentService.getAllStudents();
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

    // @POST
    // @Path("/{studentId}/enroll")
    // @Transactional
    // public Response enrollModules(@PathParam("studentId") Long studentId, List<Long> moduleIds) {
    //     Student student = studentService.getStudentById(studentId);
    //     if(student==null){
    //         return Response.status(Response.Status.NOT_FOUND).build();
    //     }

        // List<Enrollment> enrollments = new ArrayList<>();
        // for (Long moduleId : moduleIds){
        //     Module module = moduleService.getModuleById(moduleId);
        //     if(module==null){
        //         return Response.status(Response.Status.NOT_FOUND).build();
        //     }

        //     Enrollment enrollment = new Enrollment();
        //     enrollment.setStudent(student);
        //     enrollment.setModule(module);   
        //     enrollment.setEnrolledDate(LocalDate.now());
        //     enrollmentService.createEnrollment(enrollment);
        //     enrollments.add(enrollment);

        // }
        // return Response.status(Response.Status.CREATED).entity(enrollments).build();
    // }


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
