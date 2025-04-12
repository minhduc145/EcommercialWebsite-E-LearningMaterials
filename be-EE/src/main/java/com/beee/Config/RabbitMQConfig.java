package com.beee.Config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration; // ✅ thêm dòng này

@Configuration // ✅ rất quan trọng!
public class RabbitMQConfig {
	public static final String QUEUE = "demoQueue";
	public static final String EXCHANGE = "demoExchange";
	public static final String ROUTING_KEY = "demo.key";

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
