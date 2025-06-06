package com.beee.Controller.AdminController;

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
@RequestMapping("/api/admin/subscriptions")

public class SubscriptionAdminController {
	private final SubscriptionService subscriptionService;
	private final AccountService accountService;
	private final QueueService queueService;
	private final JwtService jwtService;
	private final RefundRequestRepo refundRequestRepo;
	private final RabbitMQProducer rabbitMQProducer;

	public SubscriptionAdminController(SubscriptionService subscriptionService, AccountService accountService, QueueService queueService, JwtService jwtService, RefundRequestRepo refundRequestRepo, RabbitMQProducer rabbitMQProducer) {
		this.subscriptionService = subscriptionService;
		this.accountService = accountService;
		this.queueService = queueService;
		this.jwtService = jwtService;
		this.refundRequestRepo = refundRequestRepo;
		this.rabbitMQProducer = rabbitMQProducer;
	}

	@GetMapping("/returnRequest")
	public ResponseEntity getreturnRequest(@CookieValue(name = "jwt") String
			                                       userToken, @RequestParam(required = false, defaultValue = " ") String
			                                       keyword, @RequestParam(required = false, defaultValue = "all") String sort) {
		List<RefundRequestModel> lst = new ArrayList<>();

		if (sort.equalsIgnoreCase("all")) {
			lst = refundRequestRepo.findAll();
		} else
			lst = refundRequestRepo.findAllByStatus(sort);

		return ResponseEntity.ok(lst);
	}

	@PostMapping("/handleReturnRequest")
	public ResponseEntity handleReturnRequest(@CookieValue(name = "jwt") String userToken, @RequestBody Map<String, String> requestBody) {
			try {
				if (requestBody != null) {
					String senderId = jwtService.extractUsername(userToken);

					String reqId = requestBody.get("reqId");
					String reason = requestBody.get("reason");
					Boolean isAccepted = requestBody.getOrDefault("action", "denied").equals(Constants.REFUND_STATUS_ACCEPTED);
					RefundRequestModel refundRequestModel = refundRequestRepo.getRefundRequestModelById(Integer.parseInt(reqId));

					Map map = new HashMap();
					map.put("senderId", senderId);
					map.put("isForEveryone", "false");
					map.put("email", refundRequestModel.getSubscription().getUser().getEmail());

					if (isAccepted) {
						refundRequestModel.setAdminReason(reason);
						refundRequestModel.setUpdateAt(LocalDateTime.now());
						refundRequestModel.setStatus(Constants.REFUND_STATUS_ACCEPTED);
						refundRequestRepo.save(refundRequestModel);
						String msg = "Yêu cầu hoàn tiền hủy đăng ký cho học liệu " + refundRequestModel.getSubscription().getCourse().getTitle() + " đã được chấp nhận.";
						String title = "Yêu cầu hoàn tiền được chấp nhận";
						map.put("message", msg);
						map.put("title", title);
						rabbitMQProducer.sendToQ1(map);
						queueService.sendEmailQueue(map);
					} else {
						String msg = "Yêu cầu hoàn tiền hủy đăng ký cho học liệu " + refundRequestModel.getSubscription().getCourse().getTitle() + " đã bị từ chối.";
						String title = "Yêu cầu hoàn tiền bị từ chối.";
						map.put("message", msg);
						map.put("title", title);
						refundRequestModel.setAdminReason(reason);
						refundRequestModel.setUpdateAt(LocalDateTime.now());
						refundRequestModel.setStatus(Constants.REFUND_STATUS_DENIED);
						refundRequestRepo.save(refundRequestModel);
						rabbitMQProducer.sendToQ1(map);
						queueService.sendEmailQueue(map);
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		return ResponseEntity.ok().build();
	}

}
