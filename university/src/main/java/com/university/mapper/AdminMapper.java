package com.university.mapper;

import com.university.dto.AdminDto;
import com.university.entity.Admin;

public class AdminMapper {
    public static Admin toEntity(AdminDto dto) {
        if (dto == null)
            return null;
        Admin admin = new Admin();
        admin.setAdminId(dto.getId());
        admin.setUsername(dto.getUsername());
        admin.setEmail(dto.getEmail());
        return admin;
    }

    public static AdminDto toDto(Admin admin) {
        if (admin == null)
            return null;
        return new AdminDto(
                admin.getAdminId(),
                admin.getUsername(),
                admin.getEmail());
    }
}