package com.beee.Service;

import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface SearchService {
	ResponseEntity getCourseSearchProperties();

	ResponseEntity courseSearchForUser(Map<String, Object> body) ;
}
