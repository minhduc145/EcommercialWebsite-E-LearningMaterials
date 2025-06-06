package com.beee.Controller;

import com.beee.Model.AccountModel;
import com.beee.Model.NotificationModel;
import com.beee.Repository.AccountRepo;
import com.beee.Repository.NotificationRepo;
import com.beee.Service.AccountService;
import com.beee.Service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
	private final AccountService accountService;
	private final NotificationRepo notificationRepo;
	private final JwtService jwtService;
	private final AccountRepo accountRepo;

	public NotificationController(AccountService accountService, NotificationRepo notificationRepo, JwtService jwtService, AccountRepo accountRepo) {
		this.accountService = accountService;
		this.notificationRepo = notificationRepo;
		this.jwtService = jwtService;
		this.accountRepo = accountRepo;
	}

	@GetMapping("/getPreviewByCookie")
	public ResponseEntity getPreviewByCookie(@CookieValue(name = "jwt", required = false) String userToken) {
		if(userToken == null) {return null;}
		if (!accountService.isJwtOk(userToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		String username = jwtService.extractUsername(userToken);
		AccountModel accountModel = accountRepo.findAccountModelById(username);
		List<NotificationModel> msgs = notificationRepo.findTop10ByReceiver_IdOrIsForEveryoneTrueAndCreatedAtAfter(username, accountModel.getCreatedAt());
		Long count = notificationRepo.countAllByReceiver_IdOrIsForEveryoneTrueAndCreatedAtAfter(username, accountModel.getCreatedAt());
		return ResponseEntity.ok(Map.of("messages", msgs, "count", count));
	}

	@GetMapping("/getById")
	public ResponseEntity getPreviewByCookie(@CookieValue(name = "jwt") String userToken, @RequestParam Integer id) {
		if (!accountService.isJwtOk(userToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		String username = jwtService.extractUsername(userToken);
		NotificationModel notificationModel = notificationRepo.getByIdAndReceiverIdOrIsForEveryoneTrue(id, username);
		return ResponseEntity.ok(notificationModel);
	}
}