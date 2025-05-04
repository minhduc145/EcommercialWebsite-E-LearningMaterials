package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Common.Utils;
import com.beee.Model.CategoryModel;
import com.beee.Model.CourseModel;
import com.beee.Repository.*;
import com.beee.Service.Impl.S3ServiceImpl;
import com.beee.WebSecurityService.JwtService;
import jdk.jshell.execution.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
	@Autowired
	private CourseRepo courseRepo;

	@Autowired
	private ReviewRepo reviewRepo;

	@Autowired
	private CourseDataRepo courseDataRepo;
	@Autowired
	private S3ServiceImpl s3ServiceImpl;
	@Autowired
	private CategoryRepo categoryRepo;
	@Autowired
	private JwtService jwtService;
	private AccountRepo accountRepo;
	@Autowired
	private UserRepo userRepo;

	@GetMapping("/getAll")
	public ResponseEntity getAllCourses() {
		return ResponseEntity.ok(courseRepo.findAll());
	}

	@GetMapping("/search")
	public ResponseEntity searchCourses(@RequestParam Map<String, String> params) {
		Integer pageIndex = Integer.parseInt(params.get("pageIndex"));
		if (pageIndex == null || pageIndex < 1) pageIndex = 1;
		pageIndex--;
		PageRequest pr = PageRequest.of(pageIndex, 7, Sort.by(Sort.Direction.DESC, "createdAt"));
		return ResponseEntity.ok(courseRepo.findAll(pr));
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

	@PostMapping("/add/info")
	public ResponseEntity addCourseInfo(@CookieValue(name = "jwt", required = false) String jwt,
	                                    @ModelAttribute CourseModel courseModel, @RequestParam(name = "bannerFile", required = false) MultipartFile bannerFile) throws IOException {
			if (!jwtService.isTokenExpired(jwt)) {
				try {
					String username = jwtService.extractUsername(jwt);
					courseModel.setCategory(categoryRepo.findById(Integer.valueOf(courseModel.getCategoryId())).get());
					courseModel.setCreator(userRepo.findUserModelById(username));
					CourseModel saved = courseRepo.save(courseModel);


					if (bannerFile != null) {
						String randomId = UUID.randomUUID().toString();
						String fileName = bannerFile.getOriginalFilename();
						String fileKey = randomId + fileName.substring(fileName.lastIndexOf('.'));
						s3ServiceImpl.uploadFile(Constants.CLOUD_BUCKET_NAME, "banner/" + fileKey, bannerFile);
					}


					return ResponseEntity.ok(
							Utils.mapOfResponse(1,"ok",saved)
					);
				} catch (Exception e) {
					throw new RuntimeException(e);
				}
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}
	}

	@DeleteMapping("/delete")
	public ResponseEntity deleteCourses(@RequestBody List<String> params) {
		try {
			for (String id : params) {
				courseRepo.deleteById(Integer.parseInt(id));
			}
		} catch (NumberFormatException e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok(1);
	}


}
