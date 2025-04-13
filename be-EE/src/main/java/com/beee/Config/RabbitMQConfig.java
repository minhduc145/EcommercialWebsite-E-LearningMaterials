package com.beee.Config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
	public static final String QUEUE1 = "queue1";
	public static final String QUEUE2 = "queue2";
	public static final String EXCHANGE = "exchange";
	public static final String ROUTING_KEY1 = "routingKey1";
	public static final String ROUTING_KEY2 = "routingKey2";

	@Bean
	public Queue queue1() {
		return new Queue(QUEUE1,false);
	}

	@Bean
	public Queue queue2() {
		return new Queue(QUEUE2,false);
	}

	@Bean
	public TopicExchange exchange() {
		return new TopicExchange(EXCHANGE);
	}

	@Bean
	public Binding binding1(Queue queue1, TopicExchange exchange) {
		return BindingBuilder.bind(queue1).to(exchange).with(ROUTING_KEY1);
	}

	@Bean
	public Binding binding2(Queue queue2, TopicExchange exchange) {
		return BindingBuilder.bind(queue2).to(exchange).with(ROUTING_KEY2);
	}

	@Bean
	public AmqpAdmin amqpAdmin(ConnectionFactory connectionFactory) {
		return new RabbitAdmin(connectionFactory);
	}
}
