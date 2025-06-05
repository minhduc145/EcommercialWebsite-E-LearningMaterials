package com.beee.Common;


import com.beee.DTO.CourseBasicResDTO;
import com.beee.Repository.ReviewRepo;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Component
public class Utils {
	private final ReviewRepo reviewRepo;

	public Utils(ReviewRepo reviewRepo) {
		this.reviewRepo = reviewRepo;
	}

	public final static Map mapOfResponse(Integer status, String message, Object details) {
		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("result", status);
		responseBody.put("message", message);
		responseBody.put("details", details);
		return responseBody;
	}

	public final static String detectFileCategory(String contentType) {
		if (Constants.DOCUMENT_TYPES.contains(contentType) || contentType.contains("document")) return "document";
		if (contentType.contains("audio"))
			return "media-audio";
		if (contentType.contains("image"))
			return "media-image";
		if (contentType.contains("video"))
			return "media-video";
		if (contentType.contains("hls"))
			return "media-hls";
		if (contentType.contains("link"))
			return "link";
		if (contentType.contains("iframe"))
			return "iframe";
		if (Constants.SCORM_TYPES.contains(contentType) || contentType.contains("scorm")) return "scorm";
		return "unknown";
	}

	public static String encodePassword(String rawPassword) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
		return encoder.encode(rawPassword);
	}

	public static Sort setSort(String sortField, boolean isDescending) {
		if (isDescending) return Sort.by(sortField).descending();
		else return Sort.by(sortField).ascending();
	}

	public static Pageable setPageable(Integer pageIndex, Integer pageSize, String sortField, boolean isDescending) {
		if (isDescending)
			return PageRequest.of(pageIndex, pageSize, setSort(sortField, isDescending));
		else return PageRequest.of(pageIndex, pageSize, setSort(sortField, isDescending));
	}

	public static void handleMapBasicDTO(List<CourseBasicResDTO> courses, Map result) {
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

	public static String removeVietnameseAccents(String input) {
		String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
		Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
		return pattern.matcher(normalized).replaceAll("")
				.replaceAll("đ", "d")
				.replaceAll("Đ", "D");
	}
}