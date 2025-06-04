package com.beee.Service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface SearchService {
	ResponseEntity getCourseSearchProperties();

	ResponseEntity courseSearchForUser(Map<String, Object> body);

	ResponseEntity favouritesSearchForUser(String userToken, Map<String, String> body);

	ResponseEntity subscriptionsSearchForUser(String userToken, Map<String, String> body);
}
