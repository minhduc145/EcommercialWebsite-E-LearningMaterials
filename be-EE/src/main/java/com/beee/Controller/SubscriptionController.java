package com.beee.Controller;

import com.beee.Model.RefundRequestModel;
import com.beee.Model.SubscriptionModel;
import com.beee.Repository.RefundRequestRepo;
import com.beee.Repository.SubscriptionRepo;
import com.beee.Service.AccountService;
import com.beee.Service.CourseService;
import com.beee.Service.SubscriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {
	private final SubscriptionService subscriptionService;
	private final AccountService accountService;
	private final RefundRequestRepo refundRequestRepo;
	private final SubscriptionRepo subscriptionRepo;

	public SubscriptionController(SubscriptionService subscriptionService, AccountService accountService, RefundRequestRepo refundRequestRepo, SubscriptionRepo subscriptionRepo) {
		this.subscriptionService = subscriptionService;
		this.accountService = accountService;
		this.refundRequestRepo = refundRequestRepo;
		this.subscriptionRepo = subscriptionRepo;
	}

	@GetMapping("/isSubscribedByUser")
	public ResponseEntity isSubscribed(@CookieValue(name = "jwt") String userToken, @RequestParam String courseId) {
		return subscriptionService.isSubscribedByUserAndCourse(userToken, courseId);
	}

	@PostMapping("/returnRequest")
	public ResponseEntity returnRequest(@CookieValue(name = "jwt") String userToken, @RequestBody Map<String, String> requestBody) {
		System.out.println(requestBody);
		if(requestBody==null||!accountService.isJwtOk(userToken)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		String subId = requestBody.get("subId");
		SubscriptionModel sub = subscriptionRepo.findSubscriptionModelById(Integer.parseInt(subId));
		if(sub!=null){
			RefundRequestModel refundRequestModel = new RefundRequestModel().builder()
					.userReason(requestBody.getOrDefault("reason",""))
					.subscription(SubscriptionModel.builder().id(Integer.valueOf(requestBody.get("subId"))).build()).build();
			refundRequestRepo.save(refundRequestModel);
			sub.setIsAvailable(false);
			sub.setStatus("Đang đợi xử lý y/c hoàn");
			subscriptionRepo.save(sub);
		}
		return ResponseEntity.ok().build();
	}
}
