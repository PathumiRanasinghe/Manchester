package com.university.service;

import com.university.entity.Course;
import com.university.repository.CourseRepository;
import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class CourseService {

	@Inject
	CourseRepository courseRepository;

	public List<Course> getAllCourses() {
		return courseRepository.listAll();
	}

	public Course getCourseById(Long id) {
		return courseRepository.findById(id);
	}

	@Transactional
	public Course createCourse(Course course) {
		courseRepository.persist(course);
		return course;
	}

	@Transactional
	public Course updateCourse(Long id, Course updatedCourse) {
		Course course = courseRepository.findById(id);
		if (course != null) {
			course.setCourseName(updatedCourse.getCourseName());
			course.setDescription(updatedCourse.getDescription());
			course.setSubjects(updatedCourse.getSubjects());
			course.setStudents(updatedCourse.getStudents());
			course.setLecturers(updatedCourse.getLecturers());
			courseRepository.persist(course);
		}
		return course;
	}

	@Transactional
	public boolean deleteCourse(Long id) {
		return courseRepository.deleteById(id);
	}
}
