package com.beee.Common;


import com.beee.Repository.ReviewRepo;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
}
