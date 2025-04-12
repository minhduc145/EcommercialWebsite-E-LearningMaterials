package com.beee.Service;

import com.beee.Config.RabbitMQConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQConsumer {
	@RabbitListener(queues = RabbitMQConfig.QUEUE)
	public void listen(String message) {
		System.out.println("Received message: " + message);
	}
}
