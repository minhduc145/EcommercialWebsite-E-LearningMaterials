package com.beee.Common;

import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

public class Utils {
	public final static Map mapOfResponse(Integer status, String message, Object details) {
		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("result", status);
		responseBody.put("message", message);
		responseBody.put("details", details);
		return responseBody;
	}

	public final static String detectFileCategory(MultipartFile file) {
		String contentType = file.getContentType();
		if (contentType == null) return "unknown";
		if (Constants.DOCUMENT_TYPES.contains(contentType)) return "document";
		if (Constants.MEDIA_TYPES.contains(contentType)) return "media";
		if (Constants.SCORM_TYPES.contains(contentType)) return "scorm";
		return "unknown";
	}



}
