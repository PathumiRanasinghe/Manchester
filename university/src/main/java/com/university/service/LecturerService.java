package com.university.service;

import com.university.entity.Lecturer;
import com.university.repository.LecturerRepository;
import com.university.exception.UserNotFoundException;
import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class LecturerService {

	@Inject
	LecturerRepository lecturerRepository;

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

	@Transactional
	public Lecturer createLecturer(Lecturer lecturer) {
		lecturerRepository.persist(lecturer);
		return lecturer;
	}

	@Transactional
	public Lecturer updateLecturer(Long id, Lecturer updatedLecturer) {
		Lecturer lecturer = lecturerRepository.findById(id);
		if (lecturer == null) {
			throw new UserNotFoundException("Lecturer with id " + id + " not found");
		}
		lecturer.setFirstName(updatedLecturer.getFirstName());
		lecturer.setLastName(updatedLecturer.getLastName());
		lecturer.setEmail(updatedLecturer.getEmail());
		lecturer.setDepartmentId(updatedLecturer.getDepartmentId());
		lecturerRepository.persist(lecturer);
		return lecturer;
	}

	@Transactional
	public boolean deleteLecturer(Long id) {
		return lecturerRepository.deleteById(id);
	}
}
