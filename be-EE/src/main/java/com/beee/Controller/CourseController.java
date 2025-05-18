package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Common.Utils;
import com.beee.DTO.CourseContainerRequestDTO;
import com.beee.DTO.CourseFileReqDTO;
import com.beee.Model.*;
import com.beee.Repository.*;
import com.beee.Service.AccountService;
import com.beee.Service.CourseService;
import com.beee.Service.FileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.util.ParsingUtils;
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
	private CourseContainerRepo courseContainerRepo;
	@Autowired
	private CourseFileRepo courseFileRepo;
	@Autowired
	private FileService fileService;
	@Autowired
	private CourseService courseService;
	@Autowired
	private AccountService accountService;

	@GetMapping("/getAll")
	public ResponseEntity getAllCourses() {
		return ResponseEntity.ok(courseRepo.findAll());
	}

	@GetMapping("/getFeatures")
	public ResponseEntity getFeatures() {
		return ResponseEntity.ok(courseRepo.findAllByIsFeaturedTrue());
	}

	@GetMapping("/search")
	public ResponseEntity searchCourses(@RequestParam Map<String, String> params) {
		Integer pageIndex = Integer.parseInt(params.getOrDefault("pageIndex", "1"));
		pageIndex--;
		String sort = params.getOrDefault("sort", "createdAt");
		sort = ParsingUtils.reconcatenateCamelCase(sort, "_");
		boolean descending = Boolean.parseBoolean(params.getOrDefault("descending", "true"));
		String keyword = params.getOrDefault("keyword", " ");
		Pageable pageable = Utils.setPageable(pageIndex, Constants.PAGEABLE_PAGE_SIZE_7, sort, descending);
		return ResponseEntity.ok(courseRepo.getCoursesWithQueryParams(keyword.trim(),pageable));
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

	@PostMapping("/info/add")
	public ResponseEntity addCourseInfo(@CookieValue(name = "jwt") String userToken,
	                                    @ModelAttribute CourseModel courseModel, @RequestParam(name = "bannerFile", required = false) MultipartFile bannerFile) throws IOException {
		return courseService.addCourseInfo(userToken, courseModel, bannerFile);
	}

	@DeleteMapping("/delete")
	public ResponseEntity deleteCourses(@CookieValue("jwt") String userToken, @RequestBody List<String> params) {
		return courseService.deleteCourses(userToken, params);
	}

	@PostMapping("/data/container/add")
	public ResponseEntity addCourseDataContainer(@CookieValue("jwt") String userToken, @Valid @RequestBody(required = false) CourseContainerRequestDTO courseContainerRequestDTO) {
		return courseService.addCourseDataContainer(userToken, courseContainerRequestDTO);
	}

	@PostMapping("/data/file/add")
	public ResponseEntity addCourseDataFile(@CookieValue("jwt") String userToken, @Valid @RequestBody(required = false) CourseFileReqDTO courseFileReqDTO) {
		return courseService.addCourseDataFile(userToken, courseFileReqDTO);
	}

	@PostMapping("/data/container/delete")
	public ResponseEntity deleteCourseDataFolder(@CookieValue("jwt") String userToken, @RequestBody(required = false) UUID id) {
		if (!accountService.isAdminJwtOk(userToken))
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		fileService.deleteFileInQueue(id.toString());
		courseContainerRepo.deleteById(id);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/data/file/delete")
	public ResponseEntity deleteCourseDataFile(@CookieValue("jwt") String userToken, @RequestBody(required = false) UUID id) {
		if (!accountService.isAdminJwtOk(userToken))
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		CourseFileModel file = courseFileRepo.findById(id).orElse(null);
		if (file != null) {
			fileService.deleteFileInQueue(file.getContainer().getId() + "/" + file.getId());
			courseFileRepo.deleteById(id);
		}
		return ResponseEntity.ok().build();
	}

	@GetMapping("/isSubscribedByUser")
	public ResponseEntity isSubscribed(@CookieValue(name = "jwt") String userToken, @RequestParam String courseId) {
		return courseService.isSubscribedByUserAndCourse(userToken, courseId);
	}


	@GetMapping("/subscription/getSummary")
	public ResponseEntity getSubscriptionSummary(@RequestParam String username, @RequestParam String courseId) {
		return courseService.getSubscriptionSummary(username, courseId);
	}
}
