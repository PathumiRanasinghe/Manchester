package com.university.rest;

import com.university.entity.Admin;
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
public class AdminResource {

    @Inject
    private AdminService adminService;
    
    @GET
    @Path("/{id}")
    public Admin getAdminById(Long id) {
        return adminService.getAdminById(id);
    }

    @GET
    @Path("/by-email")
    public Response getAdminByEmail(@QueryParam("email") String email) {
        Admin admin = adminService.getAdminByEmail(email);
        if (admin == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Admin not found").build();
        }
        return Response.ok(admin).build();
    }

   

   
}
