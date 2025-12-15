package com.university.service.impl;

import com.university.mapper.AdminMapper;
import jakarta.ws.rs.core.Response;
import com.university.entity.Admin;
import com.university.repository.AdminRepository;
import com.university.service.AdminService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class AdminServiceImpl implements AdminService {

    @Inject
    private AdminRepository adminRepository;

    public Response getAdminByEmail(String email) {
        Admin admin = adminRepository.findByEmail(email);
        if (admin == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Admin not found").build();
        }
        return Response.ok(AdminMapper.toDto(admin)).build();
    }

    public Response getAdminById(Long id) {
        Admin admin = adminRepository.findById(id);
        if (admin == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Admin not found").build();
        }
        return Response.ok(AdminMapper.toDto(admin)).build();
    }

}
