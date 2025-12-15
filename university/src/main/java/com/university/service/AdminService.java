package com.university.service;

import jakarta.ws.rs.core.Response;

public interface AdminService {
    public Response getAdminByEmail(String email);
    public Response getAdminById(Long id);
}
