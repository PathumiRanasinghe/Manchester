
package com.university.controller;

import java.util.List;
import com.university.entity.Module;
import com.university.entity.Lecturer;
import com.university.service.LecturerService;
import com.university.service.ModuleService;
import com.university.dto.ModuleDto;
import com.university.dto.LecturerDto;
import com.university.dto.DepartmentDto;
import com.university.mapper.ModuleMapper;
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

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ModuleController {

    @Inject
    private ModuleService moduleService;

    @Inject
    private LecturerService lecturerService;

    @GET
    @RolesAllowed({"admin"})
    @Path("/modules")
    public List<ModuleDto> getAllModules() {
        List<Module> modules = moduleService.getAllModules();
        return modules.stream().map(ModuleMapper::toDto).toList();
    }

    @POST
    @RolesAllowed("lecturer")
    @Path("/modules")
    public Response createModule(ModuleDto moduleDto) {
        LecturerDto lecturerDto = moduleDto.getLecturer();
        DepartmentDto departmentDto = moduleDto.getDepartment();
        Long lecturerId = lecturerDto != null ? lecturerDto.getLecturerId() : null;
        Long departmentId = departmentDto != null ? departmentDto.getDepartmentId() : null;
        if (lecturerId == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Lecturer ID is required").build();
        }
        Lecturer lecturer = lecturerService.getLecturerById(lecturerId);
        if (lecturer == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Lecturer not found").build();
        }
        if (departmentId == null && lecturer.getDepartment() != null) {
            departmentId = lecturer.getDepartment().getDepartmentId();
            departmentDto = null; // Use lecturer's department
        }
        if (departmentId == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Department ID is required").build();
        }
        Module module = ModuleMapper.toEntity(moduleDto);
        module.setLecturer(lecturer);
        module.setDepartment(lecturer.getDepartment());
        Module created = moduleService.createModule(module);
        return Response.status(Response.Status.CREATED).entity(ModuleMapper.toDto(created)).build();
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
        Module module = moduleService.getModuleById(id);
        if (module == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Module not found").build();
        }
        return Response.ok(ModuleMapper.toDto(module)).build();
    }
    
    // @POST
    // @RolesAllowed("lecturer")
    // @Path("/modules")
    // public Response createModule(ModuleDto moduleDto) {
    //     Lecturer lecturer = lecturerService.getLecturerById(moduleDto.getLecturerId());
    //     Department department = lecturer != null ? lecturer.getDepartment() : null;
    //     Module module = ModuleMapper.toEntity(moduleDto, lecturer, department);
    //     Module created = moduleService.createModule(module);
    //     return Response.status(Response.Status.CREATED).entity(ModuleMapper.toDto(created)).build();
    // }

    @PUT
    @RolesAllowed("admin")
    @Path("/modules/{id}")
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
    @Path("/modules/{id}")
    public Response deleteModule(@PathParam("id") Long id) {
        boolean deleted = moduleService.deleteModule(id);
        return deleted? Response.noContent().build() : Response.status(Response.Status.NOT_FOUND).build();
    }
}
