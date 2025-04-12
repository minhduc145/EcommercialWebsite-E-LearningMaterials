package com.beee.Config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration; // ✅ thêm dòng này
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.HashMap;

@Configuration
public class RabbitMQConfig {
	public static final String QUEUE = "queue";
	public static final String EXCHANGE = "exchange";
	public static final String ROUTING_KEY = "routingKey";

	@Bean
	public Queue queue() {
		return new Queue(QUEUE,false);
	}

	@Bean
	public TopicExchange exchange() {
		return new TopicExchange(EXCHANGE);
	}

	@Bean
	public Binding binding(Queue queue, TopicExchange exchange) {
		return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY);
	}

	@Bean
	public AmqpAdmin amqpAdmin(ConnectionFactory connectionFactory) {
		return new RabbitAdmin(connectionFactory);
	}
}
