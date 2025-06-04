package com.beee.Service.Impl;

import com.beee.Common.Constants;
import com.beee.Common.Utils;
import com.beee.DTO.CourseBasicResDTO;
import com.beee.Model.CategoryModel;
import com.beee.Model.CourseModel;
import com.beee.Repository.CategoryRepo;
import com.beee.Repository.CourseRepo;
import com.beee.Service.SearchService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.ParsingUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class SearchServiceImpl implements SearchService {
	private final CategoryRepo categoryRepo;
	private final CourseRepo courseRepo;

	public SearchServiceImpl(CategoryRepo categoryRepo, CourseRepo courseRepo) {
		this.categoryRepo = categoryRepo;
		this.courseRepo = courseRepo;
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
			CourseBasicResDTO courseBasicResDTO = CourseBasicResDTO.builder()
					.id((Integer) result.get("id"))
					.title((String) result.get("title"))
					.price((BigDecimal) result.get("price"))
					.commentCount((Long) result.get("comment_count"))
					.categoryName((String) result.get("category_name"))
					.averageRating((BigDecimal) result.get("average_rating"))
					.thumbnailUrl((String) result.get("thumbnail_url"))
					.isFeatured((Boolean) result.get("is_featured"))
					.build();
			courses.add(courseBasicResDTO);
		}
		return ResponseEntity.ok().body(Map.of("content", courses, "totalElements", results.getTotalElements(), "totalPages", results.getTotalPages()));
	}
}
