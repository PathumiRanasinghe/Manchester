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

	public Lecturer getLecturerByEmail(String email) {
		Lecturer lecturer = lecturerRepository.findByEmail(email);
		if (lecturer == null) {
			throw new UserNotFoundException("Lecturer with email " + email + " not found");
		}
		return lecturer;
	}

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
		if (lecturer.getLecturerId() != null) {
			lecturerRepository.getEntityManager().merge(lecturer);
		} else {
			lecturerRepository.persist(lecturer);
		}
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
		lecturer.setDepartment(updatedLecturer.getDepartment());
		lecturerRepository.persist(lecturer);
		return lecturer;
	}

	@Transactional
	public boolean deleteLecturer(Long id) {
		return lecturerRepository.deleteById(id);
	}
}
