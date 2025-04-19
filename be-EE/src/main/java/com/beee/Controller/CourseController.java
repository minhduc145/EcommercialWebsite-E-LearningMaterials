package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Repository.CourseDataRepo;
import com.beee.Repository.CourseRepo;
import com.beee.Repository.ReviewRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
	@Autowired
	private CourseRepo courseRepo;

	@Autowired
	private ReviewRepo reviewRepo;

	@Autowired
	private CourseDataRepo courseDataRepo;

	@GetMapping("/getAll")
	public ResponseEntity getAllCourses() {
		return ResponseEntity.ok(courseRepo.findAll());
	}

	@GetMapping("/get/{id}")
	public ResponseEntity getCourseById(@PathVariable int id) {
		return ResponseEntity.ok(courseRepo.findById(id).get());
	}

	@GetMapping("/getReview/{id}")
	public ResponseEntity getReviewById(@PathVariable int id, Integer pageIndex) {
		if (pageIndex == null || pageIndex < 1) pageIndex = 1;
		pageIndex--;
		PageRequest pr = PageRequest.of(pageIndex, Constants.PAGEABLE_PAGE_SIZE);
		Map<String, Object> map = new HashMap<>();
		map.put("reviewPageable", reviewRepo.findCourseReviewModelsByCourse_IdOrderByCreatedAtDesc(id, pr));
		map.put("starRateMeta", reviewRepo.countEachStarRateByCourseId(id));
		return ResponseEntity.ok(map);
	}

	@GetMapping("/getReview/getTotalStar/{id}")
	public ResponseEntity getReviewTotalStar(@PathVariable int id) {
		return ResponseEntity.ok(reviewRepo.sumAllStarsByCourse_Id(id));
	}

	@GetMapping("/getReview/getAverageStar/{id}")
	public ResponseEntity getAverageStar(@PathVariable int id) {
		return ResponseEntity.ok(reviewRepo.averageStarsByCourse_Id(id));
	}

	@GetMapping("/getCourseData/{id}")
	public ResponseEntity getCourseData(@PathVariable Integer id) {
		if (id != null)
			return ResponseEntity.ok(courseDataRepo.findAllByCourse_Id(id));
		else return ResponseEntity.ok(new ArrayList<String>());
	}

}
