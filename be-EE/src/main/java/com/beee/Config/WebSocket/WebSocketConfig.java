package com.beee.Config.WebSocket;

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
		config.setApplicationDestinationPrefixes("/app");// client send
		config.setUserDestinationPrefix("/user");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/ws") // endpoint để client kết nối
				.setAllowedOriginPatterns("http://localhost:3000")
//				.addInterceptors(new JwtHandshakeInterceptor())
				.withSockJS();
		registry.addEndpoint("/ws/payment")
				.setAllowedOriginPatterns("http://localhost:3000")
//				.addInterceptors(new JwtHandshakeInterceptor())
				.withSockJS();
		registry.addEndpoint("/ws/notification")
				.setAllowedOriginPatterns("http://localhost:3000")
//				.addInterceptors(new JwtHandshakeInterceptor())
				.withSockJS();
	}

//	@Autowired
//	private CustomStompInterceptor customStompInterceptor;
//
//	@Override
//	public void configureClientInboundChannel(ChannelRegistration registration) {
//		registration.interceptors(customStompInterceptor);
//	}
}
