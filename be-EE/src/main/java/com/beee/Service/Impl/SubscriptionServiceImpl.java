package com.beee.Service.Impl;

import com.beee.Common.Constants;
import com.beee.DTO.SubscriptionTabSummaryDTO;
import com.beee.Model.RefundRequestModel;
import com.beee.Model.SubscriptionModel;
import com.beee.Repository.*;
import com.beee.Service.AccountService;
import com.beee.Service.SubscriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@Component
public class SubscriptionServiceImpl implements SubscriptionService {
	private final AccountService accountService;
	private final JwtService jwtService;
	private final SubscriptionRepo subscriptionRepo;
	private final CourseRepo courseRepo;
	private final AccountRepo accountRepo;
	private final RefundRequestRepo refundRequestRepo;

	public SubscriptionServiceImpl(AccountService accountService, JwtService jwtService, SubscriptionRepo subscriptionRepo, CourseRepo courseRepo, AccountRepo accountRepo, RefundRequestRepo refundRequestRepo) {
		this.accountService = accountService;
		this.jwtService = jwtService;
		this.subscriptionRepo = subscriptionRepo;
		this.courseRepo = courseRepo;
		this.accountRepo = accountRepo;
		this.refundRequestRepo = refundRequestRepo;
	}

	public boolean isSubscribedByUser(String username, SubscriptionModel subscriptionModel) {
		boolean i;
		i = subscriptionModel != null
				|| courseRepo.existsByCreator_Id(username)
				|| accountRepo.existsByIdAndRole(username, Constants.ROLE_ADMIN);
		return i;
	}

	public ResponseEntity isSubscribedByUserAndCourse(String userToken, String courseId) {
		boolean i;
		if (accountService.isJwtOk(userToken)) {
			String username = jwtService.extractUsername(userToken);
			SubscriptionModel subscriptionModel = subscriptionRepo.findByUser_IdAndCourse_Id(username, Integer.parseInt(courseId));
			i = isSubscribedByUser(username, subscriptionModel);
			if (i) {
				boolean isAvailable = false;
				if (subscriptionModel != null) isAvailable = subscriptionModel.getIsAvailable();
				return ResponseEntity.ok().body(Map.of("inSub", i, "isAvailable", isAvailable, "subAt", subscriptionModel != null ? subscriptionModel.getCreatedAt() : ""));
			}
			return ResponseEntity.ok().body(Map.of("inSub", i));
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	public ResponseEntity addReturnRequest(String userToken, Map<String, String> requestBody) {
		if (requestBody == null || !accountService.isJwtOk(userToken)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		String subId = requestBody.get("subId");
		SubscriptionModel sub = subscriptionRepo.findSubscriptionModelById(Integer.parseInt(subId));
		if (sub != null) {
			RefundRequestModel refundRequestModel = new RefundRequestModel().builder()
					.userReason(requestBody.getOrDefault("reason", ""))
					.subscription(SubscriptionModel.builder().id(Integer.valueOf(requestBody.get("subId"))).build())
					.status(Constants.REFUND_STATUS_PENDING).build();
			refundRequestRepo.save(refundRequestModel);
			sub.setIsAvailable(false);
			sub.setStatus("Đang đợi xử lý y/c hoàn");
			subscriptionRepo.save(sub);
		}
		return ResponseEntity.ok().build();
	}
}
