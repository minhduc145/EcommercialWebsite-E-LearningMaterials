package com.beee.Service.Impl;

import com.beee.Common.Constants;
import com.beee.Common.Utils;
import com.beee.DTO.CourseContainerRequestDTO;
import com.beee.DTO.CourseFileReqDTO;
import com.beee.DTO.SubscriptionTabSummaryDTO;
import com.beee.Model.*;
import com.beee.Repository.*;
import com.beee.Service.AccountService;
import com.beee.Service.CourseService;
import com.beee.Service.FileService;
import com.beee.Service.S3Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class CourseServiceImpl implements CourseService {
	private final ReviewRepo reviewRepo;
	private final CourseContainerRepo courseContainerRepo;
	private final JwtService jwtService;
	private final AccountRepo accountRepo;
	private final CourseRepo courseRepo;
	private final SubscriptionRepo subscriptionRepo;
	private final S3Service s3Service;
	private final CourseFileRepo courseFileRepo;
	private final FileService fileService;
	private final FavouriteRepo favouriteRepo;
	private final AccountService accountService;

	public CourseServiceImpl(ReviewRepo reviewRepo, CourseContainerRepo courseContainerRepo, JwtService jwtService, AccountRepo accountRepo, CourseRepo courseRepo, SubscriptionRepo subscriptionRepo, S3Service s3Service, CourseFileRepo courseFileRepo, FileService fileService, FavouriteRepo favouriteRepo, AccountService accountService) {
		this.reviewRepo = reviewRepo;
		this.courseContainerRepo = courseContainerRepo;
		this.jwtService = jwtService;
		this.accountRepo = accountRepo;
		this.courseRepo = courseRepo;
		this.subscriptionRepo = subscriptionRepo;
		this.s3Service = s3Service;
		this.courseFileRepo = courseFileRepo;
		this.fileService = fileService;
		this.favouriteRepo = favouriteRepo;
		this.accountService = accountService;
	}

	@Override
	public List<Object[]> getStarRateCount(Integer courseId) {
		List<Object[]> results = reviewRepo.countEachStarRateByCourseId(courseId);
		Map<Integer, Long> rateCountMap = new HashMap<>();
		for (Object[] row : results) {
			Integer star = (Integer) row[0];
			Long count = (Long) row[1];
			rateCountMap.put(star, count);
		}
		List<Object[]> fullResults = new ArrayList<>();
		for (int i = 5; i >= 1; i--) {
			Object[] row = new Object[2];
			row[0] = i;
			row[1] = rateCountMap.getOrDefault(i, 0L);
			fullResults.add(row);
		}
		return fullResults;
	}


	public ResponseEntity getCourseData(Integer id) {
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

	public ResponseEntity getCourseDataWithUrl(String userToken, Integer id) {
		if (!accountService.isJwtOk(userToken))
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		String username = jwtService.extractUsername(userToken);
		if (accountRepo.existsByIdAndRole(username, Constants.ROLE_ADMIN)
				|| courseRepo.existsByIdAndCreator_Id(id, username)
				|| subscriptionRepo.existsByUser_IdAndCourse_Id(username, id))
			return ResponseEntity.ok(courseContainerRepo.findAllByCourse_IdOrderByCreatedAtAsc(id));
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	public ResponseEntity addCourseInfo(String userToken, CourseModel courseModel, MultipartFile bannerFile) throws IOException {
		if (!accountService.isAdminJwtOk(userToken))
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
			newCourse.setIsFeatured(courseModel.getIsFeatured());
			System.out.println(courseModel);
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

	public ResponseEntity deleteCourses(List<String> params) {
		try {
			for (String id : params) {
				courseRepo.deleteById(Integer.parseInt(id));
				fileService.deleteFileInQueue(id);
			}
		} catch (NumberFormatException e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok(1);
	}

	public ResponseEntity addCourseDataContainer(CourseContainerRequestDTO courseContainerRequestDTO) {
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

	public ResponseEntity addCourseDataFile(String userToken, CourseFileReqDTO courseFileReqDTO) {
		if (!accountService.isJwtOk(userToken))
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

	boolean isSubscribedByUser(String username, SubscriptionModel subscriptionModel) {
		boolean i;
		i = subscriptionModel != null
				|| courseRepo.existsByCreator_Id(username)
				|| accountRepo.existsByIdAndRole(username, Constants.ROLE_ADMIN);
		return i;
	}

	public ResponseEntity isSubscribedByUserAndCourse(String userToken, String courseId) {
		boolean i;
		if (accountService.isJwtOk(userToken)) {
			String username = jwtService.extractUsername(userToken);
			SubscriptionModel subscriptionModel = subscriptionRepo.findByUser_IdAndCourse_Id(username, Integer.parseInt(courseId));
			i = isSubscribedByUser(username, subscriptionModel);
			if (i)
				return ResponseEntity.ok().body(Map.of("inSub", i, "subAt", subscriptionModel != null ? subscriptionModel.getCreated_at() : ""));
			return ResponseEntity.ok().body(Map.of("inSub", i));
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	public ResponseEntity getSubscriptionSummary(String username, String courseId) {
		SubscriptionTabSummaryDTO summaryDTO = new SubscriptionTabSummaryDTO();
		SubscriptionModel subscriptionModel = subscriptionRepo.findByUser_IdAndCourse_Id(username, Integer.parseInt(courseId));
		boolean i = isSubscribedByUser(username, subscriptionModel);
		boolean ii = favouriteRepo.existsByUser_IdAndCourse_Id(username, Integer.valueOf(courseId));
		summaryDTO.setSubscribed(i);
		summaryDTO.setFavourite(ii);
		if (i && subscriptionModel != null) summaryDTO.setSubscribedAt(subscriptionModel.getCreated_at());
		summaryDTO.setReview(reviewRepo.getFirstByCourseIdAndUserId(Integer.parseInt(courseId), username));
		return ResponseEntity.ok().body(summaryDTO);
	}

}
