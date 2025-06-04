package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Model.CourseModel;
import com.beee.Model.CourseReviewModel;
import com.beee.Model.UserModel;
import com.beee.Repository.*;
import com.beee.Service.AccountService;
import com.beee.Service.CourseService;
import com.beee.Service.Impl.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/courses/review")
public class ReviewController {
	@Autowired
	private ReviewRepo reviewRepo;
	@Autowired
	private JwtService jwtService;
	@Autowired
	private CourseService courseService;
	@Autowired
	private AccountService accountService;

	@PostMapping("/add")
	public ResponseEntity addReview(@CookieValue(name = "jwt") String userToken, @RequestBody Map<String, String> params) {
		if (!accountService.isJwtOk(userToken))
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		String username = jwtService.extractUsername(userToken);
		CourseReviewModel courseReviewModel;
		if (params.get("reviewId") == null) {
			courseReviewModel = CourseReviewModel.builder().starRate(Integer.valueOf(params.get("star")))
					.comment(params.get("comment"))
					.user(UserModel.builder().id(username).build())
					.course(CourseModel.builder().id(Integer.valueOf(params.get("courseId"))).build()).build();
		} else {
			courseReviewModel = reviewRepo.getCourseReviewModelById(Integer.valueOf(params.get("reviewId")));
			courseReviewModel.setStarRate(Integer.valueOf(params.get("star")));
			courseReviewModel.setComment(params.get("comment"));
		}
		CourseReviewModel saved = reviewRepo.save(courseReviewModel);
		return ResponseEntity.ok(saved);
	}

	@PostMapping("/delete")
	public ResponseEntity deleteReview(@CookieValue(name = "jwt") String userToken, @RequestBody Map<String, String> params) {
		if (!accountService.isJwtOk(userToken))
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		boolean i = false;
		if (accountService.isAdminJwtOk(userToken)) {
			try {
				reviewRepo.deleteById(Integer.valueOf(params.getOrDefault("reviewId", "0")));
				i = true;
			} catch (Exception e) {
				i = false;
			}
		}else{
			String username = jwtService.extractUsername(userToken);
			i = reviewRepo.deleteByUser_IdAndId(username, Integer.valueOf(params.getOrDefault("reviewId", "0"))) == 1 ? true : false;
		}
		return ResponseEntity.ok(i);
	}

	@GetMapping("/get/getTotalStar/{id}")
	public ResponseEntity getReviewTotalStar(@PathVariable int id) {
		return ResponseEntity.ok(reviewRepo.sumAllStarsByCourse_Id(id));
	}

	@GetMapping("/get")
	public ResponseEntity getSingleReview(@RequestParam Integer courseId, @RequestParam String username) {
		CourseReviewModel review = reviewRepo.getFirstByCourseIdAndUserId(courseId, username);
		if (review == null) return ResponseEntity.notFound().build();
		return ResponseEntity.ok(review);
	}

	@GetMapping("/get/getAverageStar/{id}")
	public ResponseEntity getAverageStar(@PathVariable int id) {
		return ResponseEntity.ok(reviewRepo.averageStarsByCourse_Id(id));
	}

	@GetMapping("/get/{id}")
	public ResponseEntity getReviewById(@PathVariable int id, Integer pageIndex) {
		if (pageIndex == null || pageIndex < 1) pageIndex = 1;
		pageIndex--;
		PageRequest pr = PageRequest.of(pageIndex, Constants.PAGEABLE_PAGE_SIZE_5);
		Map<String, Object> map = new HashMap<>();
		map.put("reviewPageable", reviewRepo.findCourseReviewModelsByCourse_IdOrderByCreatedAtDesc(id, pr));
		map.put("starRateMeta", courseService.getStarRateCount(id));
		return ResponseEntity.ok(map);
	}
}
