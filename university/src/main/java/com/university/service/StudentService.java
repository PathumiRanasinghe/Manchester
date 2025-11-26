package com.university.service;

import com.university.entity.Student;
import com.university.repository.StudentRepository;
import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class StudentService {

	@Inject
	StudentRepository studentRepository;

	public List<Student> getAllStudents() {
		return studentRepository.listAll();
	}

	public Student getStudentById(Long id) {
		return studentRepository.findById(id);
	}

	@Transactional
	public Student createStudent(Student student) {
		studentRepository.persist(student);
		return student;
	}

	@Transactional
	public Student updateStudent(Long id, Student updatedStudent) {
		Student student = studentRepository.findById(id);
		if (student != null) {
			student.setFirstName(updatedStudent.getFirstName());
			student.setLastName(updatedStudent.getLastName());
			student.setEmail(updatedStudent.getEmail());
			student.setPhoneNumber(updatedStudent.getPhoneNumber());
			student.setCourse(updatedStudent.getCourse());
			student.setEnrollments(updatedStudent.getEnrollments());
			studentRepository.persist(student);
		}
		return student;
	}

	@Transactional
	public boolean deleteStudent(Long id) {
		return studentRepository.deleteById(id);
	}
}
