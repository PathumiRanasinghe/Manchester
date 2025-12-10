package com.university.service;

import java.util.List;
import com.university.entity.Lecturer;

public interface LecturerService {
    
    public Lecturer getLecturerByEmail(String email);

    public List<Lecturer> getAllLecturers();

    public Lecturer getLecturerById(Long id);

    public boolean deleteLecturer(Long id);

    public Lecturer createLecturer(Lecturer lecturer);
}
