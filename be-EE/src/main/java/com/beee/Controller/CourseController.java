package com.beee.Controller;

import com.beee.Common.Utils;
import com.beee.DTO.CourseBasicResDTO;
import com.beee.Model.*;
import com.beee.Repository.*;
import com.beee.Service.CourseService;
import com.beee.Service.Impl.SearchServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
	@Autowired
	private CourseRepo courseRepo;
	@Autowired
	private CourseService courseService;

	@GetMapping("/getAll")
	public ResponseEntity getAllCourses() {
		return ResponseEntity.ok(courseRepo.findAll());
	}

	@GetMapping("/getFeatures")
	public ResponseEntity getFeatures() {
		List<CourseBasicResDTO> courses = new ArrayList<>();
		List<Map> results = courseRepo.findAllByIsFeaturedTrue();
		for (Map result : results) {
			Utils.handleMapBasicDTO(courses, result);
		}
		return ResponseEntity.ok(courses);
	}

	@GetMapping("/get/{id}")
	public ResponseEntity getCourseById(@PathVariable int id) {
		CourseModel courseModel = courseRepo.findCourseModelById(id);
		if (courseModel != null) return ResponseEntity.ok(courseModel);
		else return ResponseEntity.notFound().build();
	}

	@GetMapping("/getCourseData/{id}")
	public ResponseEntity getCourseData(@PathVariable Integer id) {
		return courseService.getCourseData(id);
	}


	@GetMapping("/getCourseDataWithUrl/{id}")
	public ResponseEntity getCourseDataWithUrl(@CookieValue(name = "jwt") String userToken, @PathVariable Integer id) {
		return courseService.getCourseDataWithUrl(userToken, id);
	}
	@GetMapping("/getSummary")
	public ResponseEntity getSubscriptionSummary(@RequestParam String username, @RequestParam String courseId) {
		return courseService.getSubscriptionSummary(username, courseId);
	}
}
