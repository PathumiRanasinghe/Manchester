 
package com.university.service.impl;

import com.university.entity.Admin;
import com.university.repository.AdminRepository;
import com.university.service.AdminService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class AdminServiceImpl implements AdminService{

    @Inject
    private AdminRepository adminRepository;

    
    public Admin getAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public Admin getAdminById(Long id){
        return adminRepository.findById(id);
    }


}
