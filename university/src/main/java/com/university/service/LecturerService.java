package com.university.service;

import com.university.entity.Lecturer;
import com.university.repository.LecturerRepository;
import com.university.exception.UserNotFoundException;
import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;


@ApplicationScoped
public class LecturerService {
	@Inject
	LecturerRepository lecturerRepository;

	public Lecturer getLecturerByEmail(String email) {
		Lecturer lecturer = lecturerRepository.findByEmail(email);
		if (lecturer == null) {
			throw new UserNotFoundException("Lecturer with email " + email + " not found");
		}
		return lecturer;
	}

	public List<Lecturer> getAllLecturers() {
		return lecturerRepository.listAll();
	}

	public Lecturer getLecturerById(Long id) {
		Lecturer lecturer = lecturerRepository.findById(id);
		if (lecturer == null) {
			throw new UserNotFoundException("Lecturer with id " + id + " not found");
		}
		return lecturer;
	}

}
