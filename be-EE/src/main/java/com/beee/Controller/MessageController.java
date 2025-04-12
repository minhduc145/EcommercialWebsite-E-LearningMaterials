package com.beee.Controller;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
public class MessageController {

	private final SimpMessagingTemplate messagingTemplate;

	public MessageController(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}

	// Gửi test message đến tất cả subscriber
	@PostMapping("/api/test-message")
	public String sendMessage(@RequestParam(defaultValue = "Hello from server!") String message) {
		messagingTemplate.convertAndSend("/topic/test", message);
		return "Message sent!";
	}
}
