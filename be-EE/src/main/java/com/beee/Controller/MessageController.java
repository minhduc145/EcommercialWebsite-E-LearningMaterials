package com.beee.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController("/api/messageBroker")
public class MessageController {
	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@PostMapping("/sendMessage")
	public String sendMessage(@RequestParam(defaultValue = "") String message) {
		messagingTemplate.convertAndSend("/topic/receive", message);
		return "Message sent!";
	}
}
