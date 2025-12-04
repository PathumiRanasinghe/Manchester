package com.university.rest;

import java.util.List;

import org.eclipse.microprofile.jwt.JsonWebToken;

import com.university.entity.Admin;
import com.university.entity.Lecturer;
import com.university.entity.Student;
import com.university.service.AdminService;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/admins")
@RolesAllowed({"admin"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminResource {

    @Inject 
    AdminService adminService;

    @Inject
    JsonWebToken jwt;

    @GET
    @Path("/students")
    public List<Student> getAllStudents(){
        return adminService.getAllStudents();
    }

    @GET
    @Path("/lecturers")
    public List<Lecturer> getAllLecturers(){
        return adminService.getAllLecturers();
    }

    @GET
    public List<Admin> getAllAdmin(){
        return adminService.getAllAdmin();
    }

    @GET
    @Path("/{id}")
    public Admin getAdminById(Long id){
        return adminService.getAdminById(id);
    }

    @POST
    public Response createAdmin(Admin admin){
        Admin created = adminService.createAdmin(admin);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }


    
}
