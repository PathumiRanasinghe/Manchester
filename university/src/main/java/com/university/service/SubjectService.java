package com.university.service;

import com.university.entity.Subject;
import com.university.repository.SubjectRepository;
import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class SubjectService {

	@Inject
	SubjectRepository subjectRepository;

	public List<Subject> getAllSubjects() {
		return subjectRepository.listAll();
	}

	public Subject getSubjectById(Long id) {
		return subjectRepository.findById(id);
	}

	@Transactional
	public Subject createSubject(Subject subject) {
		subjectRepository.persist(subject);
		return subject;
	}

	@Transactional
	public Subject updateSubject(Long id, Subject updatedSubject) {
		Subject subject = subjectRepository.findById(id);
		if (subject != null) {
			subject.setName(updatedSubject.getName());
			subject.setCredits(updatedSubject.getCredits());
			subject.setCourse(updatedSubject.getCourse());
			subject.setLecturer(updatedSubject.getLecturer());
			subject.setEnrollments(updatedSubject.getEnrollments());
			subjectRepository.persist(subject);
		}
		return subject;
	}

	@Transactional
	public boolean deleteSubject(Long id) {
		return subjectRepository.deleteById(id);
	}
}
