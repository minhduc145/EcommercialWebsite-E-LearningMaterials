package com.beee.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		config.enableSimpleBroker("/topic"); // client subscribe
		config.setApplicationDestinationPrefixes("/app"); // client send
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/ws") // endpoint để client kết nối
				.setAllowedOriginPatterns("http://localhost:3000")
				.withSockJS(); // dùng SockJS fallback nếu browser k hỗ trợ WS
		registry.addEndpoint("/ws/payment").setAllowedOriginPatterns("http://localhost:3000").withSockJS();
	}
}
