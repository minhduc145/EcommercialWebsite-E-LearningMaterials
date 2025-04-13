package com.beee.Config.WebSocket;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
public class CustomStompInterceptor implements ChannelInterceptor {

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
			if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
				String username = accessor.getFirstNativeHeader("username");
				String destination = accessor.getDestination();
				System.out.println("💬 SUBSCRIBE từ: " + username + " → " + destination);
				accessor.getSessionAttributes().put("username", username);
			}
		return message;
	}
}
