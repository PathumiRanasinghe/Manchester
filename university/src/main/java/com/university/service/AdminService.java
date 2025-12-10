package com.university.service;

import com.university.entity.Admin;

public interface AdminService {
    public Admin getAdminByEmail(String email);
    public Admin getAdminById(Long id);
}
