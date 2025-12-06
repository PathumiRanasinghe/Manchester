package com.university.rest;

import java.util.List;
import com.university.entity.Department;
import com.university.service.DepartmentService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/departments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DepartmentResource {

    @Inject
    DepartmentService departmentService;

    @GET
    @RolesAllowed({"admin", "lecturer", "student"})
    public List<Department> getDepartments() {
        return departmentService.getAllDepartments();
    }

    @GET
    @RolesAllowed({"admin", "lecturer", "student"})
    @Path("/{id}")
    public Department getDepartmentById(@PathParam("id") Long id) {
        return departmentService.getDepartmentById(id);
    }

    @POST
    @RolesAllowed("admin")
    public Response createDepartment(Department department) {
        Department created = departmentService.createDepartment(department);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @RolesAllowed("admin")
    @Path("/{id}")
    public Response updateDepartment(@PathParam("id") Long id, Department updatedDepartment) {
        Department department = departmentService.updateDepartment(id, updatedDepartment);
        if (department == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(department).build();
    }
}
