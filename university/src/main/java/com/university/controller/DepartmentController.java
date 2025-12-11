package com.university.controller;

import com.university.dto.DepartmentDto;
import com.university.mapper.DepartmentMapper;
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

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DepartmentController {

    @Inject
    private DepartmentService departmentService;

    @GET
    @RolesAllowed({"admin", "lecturer", "student"})
    @Path("/departments")
    public List<DepartmentDto> getDepartments() {
        List<Department> departments = departmentService.getAllDepartments();
        return departments.stream().map(DepartmentMapper::toDto).toList();
    }

    @GET
    @RolesAllowed({"admin", "lecturer", "student"})
    @Path("/departments/{id}")
    public Response getDepartmentById(@PathParam("id") Long id) {
        Department department = departmentService.getDepartmentById(id);
        if (department == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Department not found").build();
        }
        return Response.ok(DepartmentMapper.toDto(department)).build();
    }

    @POST
    @RolesAllowed("admin")
    @Path("/departments")
    public Response createDepartment(DepartmentDto departmentDto) {
        Department created = DepartmentMapper.toEntity(departmentDto);
        departmentService.createDepartment(created);
        return Response.status(Response.Status.CREATED).entity(DepartmentMapper.toDto(created)).build();
    }

    @PUT
    @RolesAllowed("admin")
    @Path("/departments/{id}")
    public Response updateDepartment(@PathParam("id") Long id, DepartmentDto updatedDepartmentDto) {
        Department department = DepartmentMapper.toEntity(updatedDepartmentDto);
        department.setDepartmentId(id);
        Department updated = departmentService.updateDepartment(id, department);
        if (updated == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(DepartmentMapper.toDto(updated)).build();
    }
}
