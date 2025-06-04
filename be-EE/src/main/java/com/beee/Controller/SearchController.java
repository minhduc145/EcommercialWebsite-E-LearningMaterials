package com.beee.Controller;

import com.beee.Service.SearchService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/search")
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
	public ResponseEntity getSearch(@RequestBody(required = false) Map<String, Object> body) {
		return searchService.courseSearchForUser(body);
	}

	@PostMapping("/courses/favourites")
	public ResponseEntity getFavouritesSearch(@CookieValue(name = "jwt") String userToken, @RequestBody(required = false) Map<String, String> body) {
		return searchService.favouritesSearchForUser(userToken, body);
	}

	@PostMapping("/courses/subscriptions")
	public ResponseEntity getSubscriptionsSearch(@CookieValue(name = "jwt") String userToken, @RequestBody(required = false) Map<String, String> body) {
		return searchService.subscriptionsSearchForUser(userToken, body);
	}
}
