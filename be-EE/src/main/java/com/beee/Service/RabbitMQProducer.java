package com.beee.Service;

import com.beee.Config.RabbitMQConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RabbitMQProducer {
	@Autowired
	private RabbitTemplate rabbitTemplate;

	ObjectMapper objectMapper = new ObjectMapper();

	public void sendToQ1(Map<String, Object> map) {

		rabbitTemplate.convertAndSend(
				RabbitMQConfig.EXCHANGE,
				RabbitMQConfig.ROUTING_KEY1,
				map
		);
		System.out.println("Sent-1: " + map);
	}

	public void sendToQ2(String username, String message) {
		Map<String, Object> map = new HashMap<>();
		map.put("username", username);
		map.put("message", message);

		rabbitTemplate.convertAndSend(
				RabbitMQConfig.EXCHANGE,
				RabbitMQConfig.ROUTING_KEY2,
				map
		);
		System.out.println("Sent-2: " + map);
	}

	public void sendToFileProcessQueue(Map map) {
		rabbitTemplate.convertAndSend(
				RabbitMQConfig.EXCHANGE,
				RabbitMQConfig.ROUTING_KEY3,
				map
		);
		System.out.println("Sent-3: " + map);
	}
}
