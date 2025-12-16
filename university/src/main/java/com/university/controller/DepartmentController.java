package com.university.controller;

import com.university.dto.DepartmentDto;
import com.university.dto.PaginatedResponse;
import com.university.service.DepartmentService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DepartmentController {

    @Inject
    private DepartmentService departmentService;

    @GET
    @RolesAllowed({"admin", "lecturer", "student"})
    @Path("/departments")
    public PaginatedResponse<DepartmentDto> getDepartments(@QueryParam("page") Integer page, @QueryParam("pageSize") Integer pageSize) {
        return departmentService.getAllDepartments(page, pageSize);
    }

    @GET
    @RolesAllowed({"admin", "lecturer", "student"})
    @Path("/departments/{id}")
    public Response getDepartmentById(@PathParam("id") Long id) {
        return departmentService.getDepartmentById(id);
    }

    @POST
    @RolesAllowed("admin")
    @Path("/departments")
    public Response createDepartment(@Valid DepartmentDto departmentDto) {
        return departmentService.createDepartment(departmentDto);
    }

    @PUT
    @RolesAllowed("admin")
    @Path("/departments/{id}")
    public Response updateDepartment(@PathParam("id") Long id,@Valid DepartmentDto updatedDepartmentDto) {
        return departmentService.updateDepartment(id, updatedDepartmentDto);
    }
    @GET
    @RolesAllowed({"admin"})
    @Path("/departments/count")
    public Response getDepartmentCount() {
        long count = departmentService.getAllDepartments(1, 1).getTotal();
        return Response.ok(count).build();
    }
}
