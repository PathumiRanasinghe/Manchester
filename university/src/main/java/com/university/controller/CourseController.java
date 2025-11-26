
package com.university.controller;


import java.util.List;

import com.university.entity.Course;
import com.university.service.CourseService;
import jakarta.inject.Inject;
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

@Path("/courses")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CourseController {

    @Inject
    CourseService courseService;

    @GET
    public List<Course> getCourses() {
        return courseService.getAllCourses();
    }

    @GET
    @Path("/{id}")
    public Course getCourse(@PathParam("id") Long id) {
        return courseService.getCourseById(id);
    }

    @POST
    public Response createCourse(Course course) {
        Course created = courseService.createCourse(course);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateCourse(@PathParam("id") Long id, Course updatedCourse) {
        Course course = courseService.updateCourse(id, updatedCourse);
        if (course == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(course).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteCourse(@PathParam("id") Long id) {
        boolean deleted = courseService.deleteCourse(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}
