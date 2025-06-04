package com.beee.Controller.AdminController;

import com.beee.Common.Constants;
import com.beee.Repository.AccountRepo;
import com.beee.Repository.NotificationRepo;
import com.beee.Service.AccountService;
import com.beee.Service.JwtService;
import com.beee.Service.RabbitMQProducer;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.util.ParsingUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/notifications")
public class NotificationAdminController {
	private final AccountService accountService;
	private final NotificationRepo notificationRepo;
	private final RabbitMQProducer rabbitMQProducer;
	private final JwtService jwtService;
	private final AccountRepo accountRepo;

	public NotificationAdminController(AccountService accountService, NotificationRepo notificationRepo, RabbitMQProducer rabbitMQProducer, JwtService jwtService, AccountRepo accountRepo) {
		this.accountService = accountService;
		this.notificationRepo = notificationRepo;
		this.rabbitMQProducer = rabbitMQProducer;
		this.jwtService = jwtService;
		this.accountRepo = accountRepo;
	}

	@GetMapping
	public ResponseEntity getAllMessages(@RequestParam Map<String, String> params) {
		Integer page = Integer.valueOf(params.getOrDefault("page", "0"));
		String sort = params.getOrDefault("sort", "createdAt");
		Boolean descending = Boolean.parseBoolean(params.getOrDefault("descending", "true"));
		String keyword = params.getOrDefault("keyword", "");
		Pageable pageable;
		sort = ParsingUtils.reconcatenateCamelCase(sort, "_");
		if (descending != null && descending)
			pageable = PageRequest.of(page, Constants.PAGEABLE_PAGE_SIZE_5, Sort.by(sort).descending());
		else pageable = PageRequest.of(page, Constants.PAGEABLE_PAGE_SIZE_5, Sort.by(sort).ascending());
		return ResponseEntity.ok(notificationRepo.findByIdOrTitleOrMessageOrSenderId(keyword, pageable));
	}

	@DeleteMapping
	public ResponseEntity deleteMsg(@RequestBody Map<String, Object> params) {
		if (params.get("id") != null) {
			List<Integer> ids = (ArrayList<Integer>) params.get("id");
			for (Integer id : ids) {
				notificationRepo.deleteById(id);
			}
		}
		return ResponseEntity.ok().build();
	}

	@PostMapping
	public ResponseEntity sendMessage(@CookieValue(name = "jwt") String userToken, @RequestBody Map<String, Object> messageBody) {
		String senderId = jwtService.extractUsername(userToken);
		messageBody.put("senderId", senderId);
		rabbitMQProducer.sendToQ1(messageBody);
		return ResponseEntity.ok().build();
	}
}
