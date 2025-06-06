package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Model.RefundRequestModel;
import com.beee.Repository.RefundRequestRepo;
import com.beee.Service.AccountService;
import com.beee.Service.Impl.JwtService;
import com.beee.Service.QueueService;
import com.beee.Service.RabbitMQProducer;
import com.beee.Service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {
	private final SubscriptionService subscriptionService;
	private final AccountService accountService;
	private final QueueService queueService;
	private final JwtService jwtService;
	private final RefundRequestRepo refundRequestRepo;
	private final RabbitMQProducer rabbitMQProducer;

	public SubscriptionController(SubscriptionService subscriptionService, AccountService accountService, QueueService queueService, JwtService jwtService, RefundRequestRepo refundRequestRepo, RabbitMQProducer rabbitMQProducer) {
		this.subscriptionService = subscriptionService;
		this.accountService = accountService;
		this.queueService = queueService;
		this.jwtService = jwtService;
		this.refundRequestRepo = refundRequestRepo;
		this.rabbitMQProducer = rabbitMQProducer;
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
