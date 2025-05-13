package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Common.Utils;
import com.beee.DTO.CourseContainerRequestDTO;
import com.beee.DTO.CourseFileReqDTO;
import com.beee.Model.*;
import com.beee.Repository.*;
import com.beee.Service.CourseService;
import com.beee.Service.FileService;
import com.beee.Service.S3Service;
import com.beee.WebSecurityService.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
	@Autowired
	private CourseRepo courseRepo;
	@Autowired
	private S3Service s3Service;
	@Autowired
	private CategoryRepo categoryRepo;
	@Autowired
	private JwtService jwtService;
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private CourseContainerRepo courseContainerRepo;
	@Autowired
	private CourseFileRepo courseFileRepo;
	@Autowired
	private FileService fileService;
	@Autowired
	private SubscriptionRepo subscriptionRepo;
	@Autowired
	private AccountRepo accountRepo;
	@Autowired
	private CourseService courseService;

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
		Integer pageIndex = Integer.parseInt(params.get("pageIndex"));
		if (pageIndex == null || pageIndex < 1) pageIndex = 1;
		pageIndex--;
		PageRequest pr = PageRequest.of(pageIndex, 7, Sort.by(Sort.Direction.DESC, "createdAt"));
		return ResponseEntity.ok(courseRepo.findAll(pr));
	}

	@GetMapping("/get/{id}")
	public ResponseEntity getCourseById(@PathVariable int id) {
		CourseModel courseModel = courseRepo.findCourseModelById(id);
		if (courseModel != null) return ResponseEntity.ok(courseModel);
		else return ResponseEntity.notFound().build();
	}

	@GetMapping("/getCourseData/{id}")
	public ResponseEntity getCourseData(@PathVariable Integer id) {
		if (id != null)
			return ResponseEntity.ok(courseContainerRepo.findAllByCourse_IdOrderByCreatedAtAsc(id)
					.stream().map(data ->
							{
								List<CourseFileModel> files = data.getFiles();
								files.forEach(file -> {
									file.setUrl(null);
								});
								return data;
							}
					).collect(Collectors.toList()));
		else return ResponseEntity.ok(new ArrayList<String>());
	}


	@GetMapping("/getCourseDataWithUrl/{id}")
	public ResponseEntity getCourseDataWithUrl(@CookieValue(name = "jwt") String userToken, @PathVariable Integer id) {
		if (userToken == null || jwtService.isTokenExpired(userToken))
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		String username = jwtService.extractUsername(userToken);
		if (accountRepo.existsByIdAndRole(username, Constants.ROLE_ADMIN)
				|| courseRepo.existsByIdAndCreator_Id(id, username)
				|| subscriptionRepo.existsByUser_IdAndCourse_Id(username, id))
			return ResponseEntity.ok(courseContainerRepo.findAllByCourse_IdOrderByCreatedAtAsc(id));
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@PostMapping("/add/info")
	public ResponseEntity addCourseInfo(@CookieValue(name = "jwt") String userToken,
	                                    @ModelAttribute CourseModel courseModel, @RequestParam(name = "bannerFile", required = false) MultipartFile bannerFile) throws IOException {
		if (userToken == null || jwtService.isTokenExpired(userToken) || !accountRepo.existsByIdAndRole(jwtService.extractUsername(userToken), Constants.ROLE_ADMIN))
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		if (bannerFile != null) {
			if (!bannerFile.getContentType().startsWith("image/"))
				throw new IllegalArgumentException("Chỉ được tải tập tin ảnh lên cho ảnh bìa");
			if (bannerFile.getSize() >= 1000 * 1024)
				throw new IllegalArgumentException("Ảnh bìa không vượt quá 1MB");
		}
		try {
			String username = jwtService.extractUsername(userToken);
			CourseModel newCourse = new CourseModel();
			newCourse.setCreator(UserModel.builder().id(username).build());
			if (courseModel.getId() != null)
				newCourse = courseRepo.findCourseModelById(courseModel.getId());
			newCourse.setTitle(courseModel.getTitle().trim());
			newCourse.setDescription(courseModel.getDescription().trim());
			newCourse.setCategory(CategoryModel.builder().id(Integer.valueOf(courseModel.getCategoryId())).build());
			newCourse.setIsAvailable(courseModel.getIsAvailable());
			newCourse.setPrice(courseModel.getPrice());
			CourseModel saved = courseRepo.save(newCourse);
			if (bannerFile != null) {
				String fileName = bannerFile.getOriginalFilename();
				String fileKey = "banner" + fileName.substring(fileName.lastIndexOf('.'));
				String prefix = "course-data/" + saved.getId();
				String url = prefix + "/" + fileKey;
				s3Service.uploadFileViaSignedUrl(bannerFile, url);
				newCourse.setThumbnailUrl(Constants.CLOUD_URL_PUBLIC + "/" + url);
			} else if (!StringUtils.hasText(newCourse.getThumbnailUrl())) {
				newCourse.setThumbnailUrl(Constants.CLOUD_URL_PUBLIC + "/course-banner/default.png");
			}
			saved = courseRepo.save(saved);
			return ResponseEntity.ok(
					Utils.mapOfResponse(Constants.RESULT_SUCCESS, "ok", saved)
			);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Utils.mapOfResponse(Constants.RESULT_FAIL, "failed", e.getMessage()));
		}
	}

	@DeleteMapping("/delete")
	public ResponseEntity deleteCourses(@CookieValue("jwt") String userToken, @RequestBody List<String> params) {
		if (userToken == null || jwtService.isTokenExpired(userToken) || !accountRepo.existsByIdAndRole(jwtService.extractUsername(userToken), Constants.ROLE_ADMIN))
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		try {
			for (String id : params) {
				courseRepo.deleteById(Integer.parseInt(id));
			}
		} catch (NumberFormatException e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok(1);
	}

	@PostMapping("/add/data/container")
	public ResponseEntity addCourseDataContainer(@CookieValue("jwt") String userToken, @Valid @RequestBody(required = false) CourseContainerRequestDTO courseContainerRequestDTO) {
		if (userToken == null || jwtService.isTokenExpired(userToken) || !accountRepo.existsByIdAndRole(jwtService.extractUsername(userToken), Constants.ROLE_ADMIN))
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		CourseContainerModel container;
		if (courseContainerRequestDTO.getContainer().getId() == null) {
			container = courseContainerRequestDTO.getContainer();
			container.setCourse(new CourseModel().builder().id(courseContainerRequestDTO.getCourseId()).build());
			for (CourseFileModel cf : container.getFiles()) {
				cf.setContainer(container);
			}
		} else {
			container = courseContainerRepo.findById(courseContainerRequestDTO.getContainer().getId()).get();
			container.setName(courseContainerRequestDTO.getContainer().getName());
		}
		courseContainerRepo.save(container);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/add/data/file")
	public ResponseEntity addCourseDataFile(@CookieValue("jwt") String userToken, @Valid @RequestBody(required = false) CourseFileReqDTO courseFileReqDTO) {
		if (userToken == null || jwtService.isTokenExpired(userToken))
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		String username = jwtService.extractUsername(userToken);
		CourseFileModel file;
		if (courseFileRepo.existsById(courseFileReqDTO.getFile().getId())) {
			file = courseFileRepo.findById(courseFileReqDTO.getFile().getId()).get();
			file.setName(courseFileReqDTO.getFile().getName());
			file.setUrl(courseFileReqDTO.getFile().getUrl());
		} else {
			file = courseFileReqDTO.getFile();
			file.setContainer(CourseContainerModel.builder().id(courseFileReqDTO.getContainerId()).build());
			file.setType(Utils.detectFileCategory(file.getType()));
			file.setUser(UserModel.builder().id(username).build());
		}
		CourseFileModel saved = courseFileRepo.save(file);
		fileService.processFileInQueue(saved);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/delete/data/container")
	public ResponseEntity deleteCourseDataFolder(@CookieValue("jwt") String userToken, @RequestBody(required = false) UUID id) {
		if (userToken == null || jwtService.isTokenExpired(userToken))
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		fileService.deleteFileInQueue(id.toString());
		courseContainerRepo.deleteById(id);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/delete/data/file")
	public ResponseEntity deleteCourseDataFile(@CookieValue("jwt") String userToken, @RequestBody(required = false) UUID id) {
		if (userToken == null || jwtService.isTokenExpired(userToken))
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		CourseFileModel file = courseFileRepo.findById(id).orElse(null);
		if (file != null) {
			fileService.deleteFileInQueue(file.getContainer().getId() + "/" + file.getId());
			courseFileRepo.deleteById(id);
		}
		return ResponseEntity.ok().build();
	}

	@GetMapping("/isSubscribedByUser")
	public ResponseEntity isSubscribedByUser(@CookieValue(name = "jwt") String userToken, @RequestParam String courseId) {
		boolean i;
		if (!jwtService.isTokenExpired(userToken)) {
			String username = jwtService.extractUsername(userToken);
			SubscriptionModel subscriptionModel = subscriptionRepo.findByUser_IdAndCourse_Id(username, Integer.parseInt(courseId));
			i = subscriptionModel != null
					|| courseRepo.existsByCreator_Id(username)
					|| accountRepo.existsByIdAndRole(username, Constants.ROLE_ADMIN);
			if (i)
				return ResponseEntity.ok().body(Map.of("inSub", i, "subAt", subscriptionModel != null ? subscriptionModel.getCreated_at() : ""));
			return ResponseEntity.ok().body(Map.of("inSub", i));
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}
}
