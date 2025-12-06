
package com.university.rest;

import java.util.List;
import com.university.entity.Module;
import com.university.entity.Lecturer;
import com.university.service.ModuleService;
import com.university.service.LecturerService;

import jakarta.annotation.security.RolesAllowed;
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

@Path("/api/modules")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ModuleResource {

    @Inject
    ModuleService moduleService;

    @Inject
    LecturerService lecturerService;

    @GET
    public List<Module> getModules() {
        return moduleService.getAllModules();
    }

    @GET
    @Path("/student/{studentId}")
    public List<Module> getModulesByStudentId(@PathParam("studentId") Integer studentId) {
        return moduleService.getModulesByStudentId(studentId);
    }

    @GET
    @Path("/lecturer/{lecturerId}")
    public List<Module> getModulesByLecturerId(@PathParam("lecturerId") Integer lecturerId) {
        return moduleService.getModulesByLecturerId(lecturerId);
    }

    @GET
    @Path("/department/{departmentId}")
    public List<Module> getModulesByDepartmentId(@PathParam("departmentId") Integer departmentId) {
        return moduleService.getModulesByDepartmentId(departmentId);
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
    public Response updateModule(@PathParam("id") Long id, jakarta.json.JsonObject json) {
        Module updatedModule = new Module();
        if (json.containsKey("moduleName") && !json.isNull("moduleName")) {
            updatedModule.setModuleName(json.getString("moduleName"));
        }
        if (json.containsKey("description") && !json.isNull("description")) {
            updatedModule.setDescription(json.getString("description"));
        }
        if (json.containsKey("credits") && !json.isNull("credits")) {
            updatedModule.setCredits(json.getInt("credits"));
        }
        if (json.containsKey("lecturerId") && !json.isNull("lecturerId")) {
            Lecturer lecturer = lecturerService.getLecturerById((long)json.getInt("lecturerId"));
            updatedModule.setLecturer(lecturer);
        }
        Module module = moduleService.updateModule(id, updatedModule);
        if (module == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(module).build();
    }

    @DELETE
    @RolesAllowed("admin")
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
