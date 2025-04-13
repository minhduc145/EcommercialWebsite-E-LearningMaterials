package com.beee.Service;

import com.beee.Config.RabbitMQConfig;
import com.beee.Model.MessageObjectModel;
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

	public void sendToQ1(String username, String message) {
		Map<String, Object> map = new HashMap<>();
		map.put("username", username);
		map.put("message", message);
		String json = new String();
		try {
			json = objectMapper.writeValueAsString(map);
		} catch (Exception e) {
			e.printStackTrace();
		}
		rabbitTemplate.convertAndSend(
				RabbitMQConfig.EXCHANGE,
				RabbitMQConfig.ROUTING_KEY1,
				json
		);
		System.out.println("Sent-1: " + json);
	}

	public void sendToQ2(String username, String message) {
		Map<String, Object> map = new HashMap<>();
		map.put("username", username);
		map.put("message", message);
		String json = new String();
		try {
			json = objectMapper.writeValueAsString(map);
		} catch (Exception e) {
			e.printStackTrace();
		}
		rabbitTemplate.convertAndSend(
				RabbitMQConfig.EXCHANGE,
				RabbitMQConfig.ROUTING_KEY2,
				json
		);
		System.out.println("Sent-2: " + json);
	}
}
