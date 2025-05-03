package com.beee.Common;

import java.util.HashMap;
import java.util.Map;

public class Utils {
	public static Map mapOfResponse(Integer status, String message, Object details) {
		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("result", status);
		responseBody.put("message", message);
		responseBody.put("details", details);
		return responseBody;
	}
}
