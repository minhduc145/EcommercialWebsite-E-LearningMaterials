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

	public final static String detectFileCategory(String contentType) {
		if (Constants.DOCUMENT_TYPES.contains(contentType)||contentType.contains("document")) return "document";
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
		if (Constants.SCORM_TYPES.contains(contentType)||contentType.contains("scorm")) return "scorm";
		return "unknown";
	}


}
