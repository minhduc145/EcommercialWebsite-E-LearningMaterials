package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Model.MessageModel;
import com.beee.Repository.MessageRepo;
import com.beee.Service.AccountService;
import com.beee.Service.JwtService;
import com.beee.Service.RabbitMQProducer;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.util.ParsingUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
	private final AccountService accountService;
	private final MessageRepo messageRepo;
	private final RabbitMQProducer rabbitMQProducer;
	private final JwtService jwtService;

	public MessageController(AccountService accountService, MessageRepo messageRepo, RabbitMQProducer rabbitMQProducer, JwtService jwtService) {
		this.accountService = accountService;
		this.messageRepo = messageRepo;
		this.rabbitMQProducer = rabbitMQProducer;
		this.jwtService = jwtService;
	}

	@GetMapping
	public ResponseEntity getAllMessages(@CookieValue(name = "jwt") String userToken,
	                                     @RequestParam Map<String, String> params) {
		if (!accountService.isJwtOk(userToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		Integer page = Integer.valueOf(params.getOrDefault("page", "0"));
		String sort = params.getOrDefault("sort", "createdAt");
		Boolean descending = Boolean.parseBoolean(params.getOrDefault("descending", "true"));
		String keyword = params.getOrDefault("keyword", "");
		Pageable pageable;
		sort = ParsingUtils.reconcatenateCamelCase(sort, "_");
		if (descending != null && descending)
			pageable = PageRequest.of(page, Constants.PAGEABLE_PAGE_SIZE_5, Sort.by(sort).descending());
		else pageable = PageRequest.of(page, Constants.PAGEABLE_PAGE_SIZE_5, Sort.by(sort).ascending());
		return ResponseEntity.ok(messageRepo.findByIdOrTitleOrMessageOrSenderId(keyword, pageable));
	}

	@DeleteMapping
	public ResponseEntity deleteMsg(@CookieValue(name = "jwt") String userToken, @RequestBody Map<String, Object> params) {
		if (!accountService.isJwtOk(userToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		if (params.get("id") != null) {
			List<Integer> ids = (ArrayList<Integer>) params.get("id");
			for (Integer id : ids) {
				messageRepo.deleteById(id);
			}
		}
		return ResponseEntity.ok().build();
	}

	@GetMapping("/getPreviewByCookie")
	public ResponseEntity getPreviewByCookie(@CookieValue(name = "jwt") String userToken) {
		if (!accountService.isJwtOk(userToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		String username = jwtService.extractUsername(userToken);
		List<MessageModel> msgs = messageRepo.findTop10ByReceiver_IdOrIsForEveryoneTrueOrderByCreatedAtDesc(username);
		Long count = messageRepo.countAllByReceiver_IdOrIsForEveryoneTrue(username);
		return ResponseEntity.ok(Map.of("messages", msgs, "count", count));
	}

	@PostMapping
	public ResponseEntity sendMessage(@CookieValue(name = "jwt") String userToken, @RequestBody Map<String, Object> messageBody) {
		if (!accountService.isAdminJwtOk(userToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		String senderId = jwtService.extractUsername(userToken);
		messageBody.put("senderId", senderId);
		rabbitMQProducer.sendToQ1(messageBody);
		return ResponseEntity.ok().build();
	}

}