
package com.university.controller;

import java.util.List;
import jakarta.ws.rs.QueryParam;
import com.university.entity.Module;
import com.university.service.ModuleService;
import com.university.dto.ModuleDto;
import com.university.dto.PaginatedResponse;
import com.university.mapper.ModuleMapper;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
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

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ModuleController {

    @Inject
    private ModuleService moduleService;

    @GET
    @RolesAllowed({"admin"})
    @Path("/modules")
    public Response getAllModules(@QueryParam("page") Integer page,@QueryParam("pageSize") Integer pageSize) {
        PaginatedResponse<ModuleDto> response = moduleService.getAllModules(page, pageSize);
        return Response.ok(response).build();
    }

    @POST
    @RolesAllowed("lecturer")
    @Path("/modules")
    public Response createModule(@Valid ModuleDto moduleDto) {
        return moduleService.createModuleResponse(moduleDto);
    }

    @GET
    @Path("/students/{studentId}/modules")
    @RolesAllowed({"admin", "student"})
    public List<ModuleDto> getModulesByStudentId(@PathParam("studentId") Long studentId) {
        List<Module> modules = moduleService.getModulesByStudentId(studentId);
        return modules.stream().map(ModuleMapper::toDto).toList();
    }

    @GET
    @RolesAllowed({"admin", "lecturer", "student"})
    @Path("/lecturers/{lecturerId}/modules")
    public List<ModuleDto> getModulesByLecturerId(@PathParam("lecturerId") Integer lecturerId) {
        List<Module> modules = moduleService.getModulesByLecturerId(lecturerId);
        return modules.stream().map(ModuleMapper::toDto).toList();
    }

    @GET
    @RolesAllowed({"admin", "student"})
    @Path("/departments/{departmentId}/modules")
    public List<ModuleDto> getModulesByDepartmentId(@PathParam("departmentId") Integer departmentId) {
        List<Module> modules = moduleService.getModulesByDepartmentId(departmentId);
        return modules.stream().map(ModuleMapper::toDto).toList();
    }

    @GET
    @RolesAllowed({"admin", "lecturer", "student"})
    @Path("/modules/{id}")
    public Response getModuleById(@PathParam("id") Long id) {
        return moduleService.getModuleByIdResponse(id);
    }
 
    @PUT
    @RolesAllowed("admin")
    @Path("/modules/{id}")
    public Response updateModule(@PathParam("id") Long id,@Valid ModuleDto moduleDto) {
        return moduleService.updateModuleResponse(id, moduleDto);
    }

    @DELETE
    @RolesAllowed("admin")
    @Path("/modules/{id}")
    public Response deleteModule(@PathParam("id") Long id) {
        return moduleService.deleteModuleResponse(id);
    }
    @GET
    @RolesAllowed({"admin"})
    @Path("/modules/count")
    public Response getModuleCount() {
        long count = moduleService.getAllModules(1, 1).getTotal();
        return Response.ok(count).build();
    }
}
