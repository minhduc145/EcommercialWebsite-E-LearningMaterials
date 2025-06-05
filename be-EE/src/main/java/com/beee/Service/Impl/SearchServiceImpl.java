package com.beee.Service.Impl;

import com.beee.Common.Constants;
import com.beee.Common.Utils;
import com.beee.DTO.CourseBasicResDTO;
import com.beee.Model.*;
import com.beee.Repository.*;
import com.beee.Service.SearchService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.ParsingUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class SearchServiceImpl implements SearchService {
	private final CategoryRepo categoryRepo;
	private final CourseRepo courseRepo;
	private final FavouriteRepo favouriteRepo;
	private final JwtService jwtService;
	private final SubscriptionRepo subscriptionRepo;
	private final RefundRequestRepo refundRequestRepo;
	private final NotificationRepo notificationRepo;

	public SearchServiceImpl(CategoryRepo categoryRepo, CourseRepo courseRepo, FavouriteRepo favouriteRepo, JwtService jwtService, SubscriptionRepo subscriptionRepo, RefundRequestRepo refundRequestRepo, NotificationRepo notificationRepo) {
		this.categoryRepo = categoryRepo;
		this.courseRepo = courseRepo;
		this.favouriteRepo = favouriteRepo;
		this.jwtService = jwtService;
		this.subscriptionRepo = subscriptionRepo;
		this.refundRequestRepo = refundRequestRepo;
		this.notificationRepo = notificationRepo;
	}

	@Override
	public ResponseEntity getCourseSearchProperties() {
		BigDecimal maxPrice = new BigDecimal("0");
		List<CategoryModel> categories = new ArrayList<>();
		categories = categoryRepo.findAll();
		CourseModel course = courseRepo.findTopByOrderByPriceDesc();
		if (course != null) {
			maxPrice = course.getPrice();
		}
		return ResponseEntity.ok().body(Map.of("maxPrice", maxPrice, "categories", categories));
	}

	@Override
	public ResponseEntity courseSearchForUser(Map<String, Object> body) {
		if (body == null) body = new HashMap<>();
		List<CourseBasicResDTO> courses = new ArrayList<>();
		String title = body.getOrDefault("title", "").toString();
		List<String> categories = (List<String>) body.get("categories");
		BigDecimal price1 = new BigDecimal(body.getOrDefault("price1", 0).toString());
		BigDecimal price2 = new BigDecimal(body.getOrDefault("price2", Float.MAX_VALUE).toString());
		LocalDate startDate = LocalDate.parse(body.getOrDefault("startDate", "2009-12-31").toString());
		LocalDate endDate = LocalDate.parse(body.getOrDefault("endDate", "2090-12-31").toString());
		boolean takeFeatures = (boolean) body.getOrDefault("takeFeatures", false);
		String sort = body.getOrDefault("sort", "createdAt").toString();
		sort = ParsingUtils.reconcatenateCamelCase(sort, "_");
		boolean descending = (boolean) body.getOrDefault("descending", false);
		Integer page = Integer.valueOf(body.getOrDefault("page", "0").toString());
		Pageable pageable = Utils.setPageable(page, Constants.PAGEABLE_PAGE_SIZE_7 + 1, sort, descending);
		Page<Map> results;
		if (categories == null || categories.isEmpty()) {
			results = courseRepo.searchCourseUser(title, price1, price2, startDate, endDate, takeFeatures, pageable);
		} else {
			results = courseRepo.searchCourseUser(title, categories, price1, price2, startDate, endDate, takeFeatures, pageable);
		}
		for (Map result : results.getContent()) {
			Utils.handleMapBasicDTO(courses, result);
		}
		return ResponseEntity.ok().body(Map.of("content", courses, "totalElements", results.getTotalElements(), "totalPages", results.getTotalPages()));
	}

	public ResponseEntity favouritesSearchForUser(String userToken, Map<String, String> body) {
		if (!StringUtils.hasText(userToken) || jwtService.isTokenExpired(userToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		if (body == null) body = new HashMap<>();
		String keyword = body.getOrDefault("keyword", " ").toString();
		String sort = body.getOrDefault("sort", "createdAt").toString();
		sort = ParsingUtils.reconcatenateCamelCase(sort, "_");
		boolean descending = body.getOrDefault("descending", "false").equals("true");
		Integer page = Integer.valueOf(body.getOrDefault("page", "0").toString());
		Pageable pageable = PageRequest.of(page, Constants.PAGEABLE_PAGE_SIZE_7 - 1);
		Page<UserFavouriteModel> results;

		if (sort.equalsIgnoreCase("createdAt")) {
			pageable = Utils.setPageable(page, Constants.PAGEABLE_PAGE_SIZE_7 - 1, sort, descending);
			results = favouriteRepo.findAllByUser_Id(jwtService.extractUsername(userToken), keyword, pageable);
		} else if (sort.equalsIgnoreCase("title")) {
			if (descending) {
				results = favouriteRepo.findAllByUser_IdTitleDESC(jwtService.extractUsername(userToken), keyword, pageable);
			} else
				results = favouriteRepo.findAllByUser_IdTitleASC(jwtService.extractUsername(userToken), keyword, pageable);
		} else {
			if (descending) {
				results = favouriteRepo.findAllByUser_IdPriceDesc(jwtService.extractUsername(userToken), keyword, pageable);
			} else
				results = favouriteRepo.findAllByUser_IdPriceAsc(jwtService.extractUsername(userToken), keyword, pageable);
		}
		return ResponseEntity.ok().body(results);
	}

	@Override
	public ResponseEntity subscriptionsSearchForUser(String userToken, Map<String, String> body) {
		if (!StringUtils.hasText(userToken) || jwtService.isTokenExpired(userToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		if (body == null) body = new HashMap<>();
		String keyword = body.getOrDefault("keyword", " ").toString();
		String sort = body.getOrDefault("sort", "createdAt").toString();
		sort = ParsingUtils.reconcatenateCamelCase(sort, "_");
		boolean descending = body.getOrDefault("descending", "false").equals("true");
		Integer page = Integer.valueOf(body.getOrDefault("page", "0").toString());
		Pageable pageable = PageRequest.of(page, Constants.PAGEABLE_PAGE_SIZE_7 - 1);
		Page<SubscriptionModel> results;

		if (sort.equalsIgnoreCase("createdAt")) {
			pageable = Utils.setPageable(page, Constants.PAGEABLE_PAGE_SIZE_7 - 1, sort, descending);
			results = subscriptionRepo.findAllByUser_Id(jwtService.extractUsername(userToken), keyword, pageable);
		} else if (sort.equalsIgnoreCase("title")) {
			if (descending) {
				results = subscriptionRepo.findAllByUser_IdTitleDESC(jwtService.extractUsername(userToken), keyword, pageable);
			} else
				results = subscriptionRepo.findAllByUser_IdTitleASC(jwtService.extractUsername(userToken), keyword, pageable);
		} else {
			if (descending) {
				results = subscriptionRepo.findAllByUser_IdPriceDesc(jwtService.extractUsername(userToken), keyword, pageable);
			} else
				results = subscriptionRepo.findAllByUser_IdPriceAsc(jwtService.extractUsername(userToken), keyword, pageable);
		}
		return ResponseEntity.ok().body(results);
	}

	@Override
	public ResponseEntity refundRequestsSearchForUser(String userToken, Map<String, String> body) {
		if (!StringUtils.hasText(userToken) || jwtService.isTokenExpired(userToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		if (body == null) body = new HashMap<>();
		String sort = body.getOrDefault("sort", "all").toString();
		String keyword = body.getOrDefault("keyword", "").toString();
		keyword = Utils.removeVietnameseAccents(keyword);
		System.out.println(keyword);
		List<RefundRequestModel> rs = new ArrayList<>();
		if (sort.equalsIgnoreCase("all")) {
			rs = refundRequestRepo.findAllBySubscriptionUserIdAndSubscriptionCourseTitleContaining(jwtService.extractUsername(userToken),keyword);
		} else if (sort.equalsIgnoreCase(Constants.REFUND_STATUS_ACCEPTED) || sort.equalsIgnoreCase(Constants.REFUND_STATUS_DENIED) || sort.equalsIgnoreCase(Constants.REFUND_STATUS_PENDING)) {
			rs = refundRequestRepo.findAllBySubscriptionUserIdAndSubscriptionCourseTitleContainingAndStatus(jwtService.extractUsername(userToken),keyword, sort.toLowerCase());
		} else if (sort.equalsIgnoreCase("createdAt-desc")) {
			rs = refundRequestRepo.findAllBySubscriptionUserIdAndSubscriptionCourseTitleContainingOrderByCreatedAtDesc(jwtService.extractUsername(userToken),keyword);
		} else if (sort.equalsIgnoreCase("createdAt-asc")) {
			rs = refundRequestRepo.findAllBySubscriptionUserIdAndSubscriptionCourseTitleContainingOrderByCreatedAtAsc(jwtService.extractUsername(userToken),keyword);
		}
		return ResponseEntity.ok().body(rs);
	}

	@Override
	public ResponseEntity notificationsSearchForUser(String userToken, Map<String, String> body) {
		if (!StringUtils.hasText(userToken) || jwtService.isTokenExpired(userToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		if (body == null) body = new HashMap<>();
		String keyword = body.getOrDefault("keyword", "").toString();
		Integer page = Integer.valueOf(body.getOrDefault("page", "0"));
		String sort = body.getOrDefault("sort","createdAt-desc");
		boolean descending = true;

		if(sort.equalsIgnoreCase("createdAt-desc")){
			sort = "createdAt";
		}else{
			sort = "createdAt";
			descending = false;
		}

		Pageable pageable = Utils.setPageable(page, Constants.PAGEABLE_PAGE_SIZE_5, sort, descending);
		Page<NotificationModel> rs = notificationRepo.findAllByReceiverIdAndTitleContaingOrMessageContaining(jwtService.extractUsername(userToken),keyword,pageable);
		return ResponseEntity.ok().body(rs);
	}


}

