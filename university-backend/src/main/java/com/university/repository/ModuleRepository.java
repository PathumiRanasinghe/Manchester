package com.university.repository;

import com.university.entity.Module;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ModuleRepository implements PanacheRepository<Module> {
   
}
