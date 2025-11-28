
package com.university.controller;


import java.util.List;

import com.university.entity.Module;
import com.university.service.ModuleService;
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

@Path("/modules")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ModuleController {

    @Inject
    ModuleService moduleService;

    @GET
    public List<Module> getModules() {
        return moduleService.getAllModules();
    }

    @GET
    @Path("/{id}")
    public Module getModule(@PathParam("id") Long id) {
        return moduleService.getModuleById(id);
    }
        @GET
        @Path("/{id}/students")
        public List<com.university.entity.Student> getStudentsForModule(@PathParam("id") Integer id) {
            return moduleService.getStudentsForModule(id);
        }
    @POST
    public Response createModule(Module module) {
        Module created = moduleService.createModule(module);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateModule(@PathParam("id") Long id, Module updatedModule) {
        Module module = moduleService.updateModule(id, updatedModule);
        if (module == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(module).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteModule(@PathParam("id") Long id) {
        boolean deleted = moduleService.deleteModule(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}
