package com.beee.Controller.AdminController;

import com.beee.Common.Constants;
import com.beee.Common.Utils;
import com.beee.DTO.CourseContainerRequestDTO;
import com.beee.DTO.CourseFileReqDTO;
import com.beee.Model.CourseFileModel;
import com.beee.Model.CourseModel;
import com.beee.Repository.CourseContainerRepo;
import com.beee.Repository.CourseFileRepo;
import com.beee.Repository.CourseRepo;
import com.beee.Service.AccountService;
import com.beee.Service.CourseService;
import com.beee.Service.FileService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.ParsingUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/courses")
public class CourseAdminController {

	private final AccountService accountService;
	private final CourseRepo courseRepo;
	private final CourseService courseService;
	private final FileService fileService;
	private final CourseContainerRepo courseContainerRepo;
	private final CourseFileRepo courseFileRepo;

	public CourseAdminController(AccountService accountService, CourseRepo courseRepo, CourseService courseService, FileService fileService, CourseContainerRepo courseContainerRepo, CourseFileRepo courseFileRepo) {
		this.accountService = accountService;
		this.courseRepo = courseRepo;
		this.courseService = courseService;
		this.fileService = fileService;
		this.courseContainerRepo = courseContainerRepo;
		this.courseFileRepo = courseFileRepo;
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
		return ResponseEntity.ok(courseRepo.getCoursesWithQueryParams(keyword.trim(), pageable));
	}

	@PostMapping("/info/add")
	public ResponseEntity addCourseInfo(@CookieValue(name = "jwt") String userToken,
	                                    @ModelAttribute CourseModel courseModel, @RequestParam(name = "bannerFile", required = false) MultipartFile bannerFile) throws IOException {
		return courseService.addCourseInfo(userToken, courseModel, bannerFile);
	}

	@DeleteMapping("/delete")
	public ResponseEntity deleteCourses(@RequestBody List<String> params) {
		return courseService.deleteCourses(params);
	}

	@PostMapping("/data/container/add")
	public ResponseEntity addCourseDataContainer(@Valid @RequestBody(required = false) CourseContainerRequestDTO courseContainerRequestDTO) {
		return courseService.addCourseDataContainer(courseContainerRequestDTO);
	}

	@PostMapping("/data/file/add")
	public ResponseEntity addCourseDataFile(@CookieValue("jwt") String userToken, @Valid @RequestBody(required = false) CourseFileReqDTO courseFileReqDTO) {
		return courseService.addCourseDataFile(userToken, courseFileReqDTO);
	}

	@PostMapping("/data/container/delete")
	public ResponseEntity deleteCourseDataFolder(@RequestBody(required = false) UUID id) {
		fileService.deleteFileInQueue(id.toString());
		courseContainerRepo.deleteById(id);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/data/file/delete")
	public ResponseEntity deleteCourseDataFile(@RequestBody(required = false) UUID id) {
		CourseFileModel file = courseFileRepo.findById(id).orElse(null);
		if (file != null) {
			fileService.deleteFileInQueue(file.getContainer().getId() + "/" + file.getId());
			courseFileRepo.deleteById(id);
		}
		return ResponseEntity.ok().build();
	}
}
