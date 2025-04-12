package com.beee.Service;

import com.beee.Config.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RabbitMQProducer {
	@Autowired
	private RabbitTemplate rabbitTemplate;

	public void sendMessage(String message) {
		rabbitTemplate.convertAndSend(
				RabbitMQConfig.EXCHANGE,
				RabbitMQConfig.ROUTING_KEY,
				message
		);
		System.out.println("Sent: " + message);
	}
}
