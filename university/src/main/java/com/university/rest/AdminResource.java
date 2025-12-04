
package com.university.rest;

import java.util.List;

import org.eclipse.microprofile.jwt.JsonWebToken;

import com.university.entity.Admin;
import com.university.entity.Lecturer;
import com.university.entity.Student;
import com.university.entity.Department;
import com.university.service.AdminService;
import com.university.service.DepartmentService;


import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/admins")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminResource {
    @jakarta.ws.rs.DELETE
    @jakarta.ws.rs.Path("/students/{id}")
    public Response deleteStudent(@jakarta.ws.rs.PathParam("id") Long id) {
        boolean deleted = adminService.deleteStudent(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).entity("Student not found").build();
        }
    }


    @Inject 
    AdminService adminService;

    @Inject
    DepartmentService departmentService;

    @Inject
    JsonWebToken jwt;

    @GET
    @Path("/by-email")
    public Response getAdminByEmail(@jakarta.ws.rs.QueryParam("email") String email) {
        Admin admin = adminService.getAdminByEmail(email);
        if (admin == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Admin not found").build();
        }
        return Response.ok(admin).build();
    }

        /**
         * Create a student, assign role in Keycloak, and insert into DB
         */
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

   

    @GET
    @Path("/students")
    public List<Student> getAllStudents(){
        return adminService.getAllStudents();
    }

    @GET
    @Path("/lecturers")
    public List<Lecturer> getAllLecturers(){
        return adminService.getAllLecturers();
    }

    @GET
    public List<Admin> getAllAdmin(){
        return adminService.getAllAdmin();
    }

    @GET
    @Path("/{id}")
    public Admin getAdminById(Long id){
        return adminService.getAdminById(id);
    }

    @POST
    public Response createAdmin(Admin admin){
        Admin created = adminService.createAdmin(admin);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }


    
}
