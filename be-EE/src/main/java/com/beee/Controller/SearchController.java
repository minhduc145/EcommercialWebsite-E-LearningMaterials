package com.beee.Controller;

import com.beee.Service.SearchService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user/search")
public class SearchController {
	private final SearchService searchService;

	public SearchController(SearchService searchService) {
		this.searchService = searchService;
	}

	@GetMapping("/courses/getSearchProps")
	public ResponseEntity getSearchProperties() {
		return searchService.getCourseSearchProperties();
	}

	@PostMapping("/courses")
	public ResponseEntity getSearch(@RequestBody Map<String, Object> body) {
		return searchService.courseSearchForUser(body);
	}
}
