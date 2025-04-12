package com.beee.Controller;

import com.beee.Service.RabbitMQProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rabbitmq")
public class RabbitMQController {
	@Autowired
	private RabbitMQProducer producer;

	@GetMapping("/send")
	public String sendMessage() {
		producer.sendMessage("Hello RabbitMQ!");
		return "Message sent!";
	}
}
