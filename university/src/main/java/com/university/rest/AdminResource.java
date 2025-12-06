
package com.university.rest;

import java.util.List;
import org.eclipse.microprofile.jwt.JsonWebToken;
import com.university.entity.Admin;
import com.university.entity.Lecturer;
import com.university.entity.Student;
import com.university.entity.Department;
import com.university.service.AdminService;
import com.university.service.DepartmentService;
import com.university.service.StudentService;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.PathParam;

@Path("/api/admins")
@RolesAllowed("admin")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminResource {

    @Inject 
    AdminService adminService;

    @Inject
    DepartmentService departmentService;

    @Inject 
    StudentService studentService;

    @Inject
    JsonWebToken jwt;

    @DELETE
    @Path("/students/{id}")
    public Response deleteStudent(@PathParam("id") Long id) {
        boolean deleted = adminService.deleteStudent(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity("Student not found").build();
        }
    }
    
    @DELETE
    @Path("/lecturers/{id}")
    public Response deleteLecturer(@PathParam("id") Long id) {
        boolean deleted = adminService.deleteLecturer(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity("Lecturer not found").build();
        }
    }
  
    @POST
    @Path("/students")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createStudent(jakarta.json.JsonObject json) {
        try {
            Student student = new Student();
            student.setFirstName(json.getString("firstName", null));
            student.setLastName(json.getString("lastName", null));
            student.setEmail(json.getString("email", null));
            student.setPassword(json.getString("password", null));
            student.setPhoneNumber(json.getString("phoneNumber", null));
            Integer departmentId = json.containsKey("departmentId") && !json.isNull("departmentId") ? json.getInt("departmentId") : null;
            if (departmentId != null) {
                Department department = departmentService.getDepartmentById(departmentId.longValue());
                if (department == null) {
                    return Response.status(Response.Status.BAD_REQUEST).entity("Invalid departmentId").build();
                }
                student.setDepartment(department);
            } else {
                return Response.status(Response.Status.BAD_REQUEST).entity("departmentId is required").build();
            }
            Student created = adminService.createStudent(student);
            return Response.status(Response.Status.CREATED).entity(created).build();
        } catch (Exception e) {
            e.printStackTrace();
            StringBuilder sb = new StringBuilder();
            sb.append("Failed to create student: ").append(e.getMessage()).append("\n");
            for (StackTraceElement ste : e.getStackTrace()) {
                sb.append(ste.toString()).append("\n");
            }
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(sb.toString()).build();
        }
    }
    
    @POST
    @Path("/lecturers")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createLecturer(jakarta.json.JsonObject json) {
        try {
            Lecturer lecturer = new Lecturer();
            lecturer.setFirstName(json.getString("firstName", null));
            lecturer.setLastName(json.getString("lastName", null));
            lecturer.setEmail(json.getString("email", null));
            lecturer.setPassword(json.getString("password", null));
            Integer departmentId = json.containsKey("departmentId") && !json.isNull("departmentId") ? json.getInt("departmentId") : null;
            if (departmentId != null) {
                Department department = departmentService.getDepartmentById(departmentId.longValue());
                if (department == null) {
                    return Response.status(Response.Status.BAD_REQUEST).entity("Invalid departmentId").build();
                }
                lecturer.setDepartment(department);
            } else {
                return Response.status(Response.Status.BAD_REQUEST).entity("departmentId is required").build();
            }
            Lecturer created = adminService.createLecturer(lecturer);
            return Response.status(Response.Status.CREATED).entity(created).build();
        } catch (Exception e) {
            e.printStackTrace();
            StringBuilder sb = new StringBuilder();
            sb.append("Failed to create student: ").append(e.getMessage()).append("\n");
            for (StackTraceElement ste : e.getStackTrace()) {
                sb.append(ste.toString()).append("\n");
            }
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(sb.toString()).build();
        }
    }

    @GET
    public List<Admin> getAllAdmin(){
        return adminService.getAllAdmin();
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

    @GET
    @Path("/{id}")
    public Admin getAdminById(Long id){
        return adminService.getAdminById(id);
    }

}
