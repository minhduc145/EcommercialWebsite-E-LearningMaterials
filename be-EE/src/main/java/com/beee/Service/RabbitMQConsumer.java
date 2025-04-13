package com.beee.Service;

import com.beee.Config.RabbitMQConfig;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RabbitMQConsumer {
	@Autowired
	SimpMessagingTemplate template;
	ObjectMapper objectMapper = new ObjectMapper();

	//notification
	@RabbitListener(queues = "queue1")
	public void convertToWebSocketQ1(String json) {
		try {
			Map<String, Object> map = objectMapper.readValue(json, new TypeReference<>() {
			});
			String username = (String) map.get("username");
			String message = (String) map.get("message");
			template.convertAndSend("/topic/receive/" + username, message);
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("Received-1: " + json);
	}

	//payment
	@RabbitListener(queues = RabbitMQConfig.QUEUE2)
	public void convertToWebSocketQ2(String json) {
		try {
			Map<String, Object> map = objectMapper.readValue(json, new TypeReference<>() {
			});
			String username = (String) map.get("username");
			String message = (String) map.get("message");
			template.convertAndSend("/topic/result/" + username, message);
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("Received-2: " + json);
	}


}
