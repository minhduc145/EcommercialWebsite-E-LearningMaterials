package com.beee.Controller;

import com.beee.Service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {
	private final SubscriptionService subscriptionService;

	public SubscriptionController(SubscriptionService subscriptionService) {
		this.subscriptionService = subscriptionService;
	}

	@GetMapping("/isSubscribedByUser")
	public ResponseEntity isSubscribed(@CookieValue(name = "jwt") String userToken, @RequestParam String courseId) {
		return subscriptionService.isSubscribedByUserAndCourse(userToken, courseId);
	}

	@PostMapping("/returnRequest")
	public ResponseEntity returnRequest(@CookieValue(name = "jwt") String userToken, @RequestBody Map<String, String> requestBody) {
		return subscriptionService.addReturnRequest(userToken, requestBody);
	}
}
