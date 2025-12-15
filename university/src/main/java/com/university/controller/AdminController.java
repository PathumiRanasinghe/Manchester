package com.university.controller;

import com.university.service.AdminService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/admins")
@RolesAllowed("admin")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminController {

    @Inject
    private AdminService adminService;
    
    @GET
    @Path("/{id}")
    public Response getAdminById(Long id) {
        return adminService.getAdminById(id);
    }

    @GET
    @Path("/by-email")
    public Response getAdminByEmail(@QueryParam("email") String email) {
       return adminService.getAdminByEmail(email);
    }
   
}
