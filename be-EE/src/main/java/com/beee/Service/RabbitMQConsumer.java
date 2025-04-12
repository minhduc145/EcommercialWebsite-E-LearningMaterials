package com.beee.Service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQConsumer {
	@Autowired
	SimpMessagingTemplate template;

	@RabbitListener(queues = "queue")
	public void convertToWebSocket(String message) {
		template.convertAndSend("/topic/result", message);
		System.out.println("Received: " + message);
	}
}
