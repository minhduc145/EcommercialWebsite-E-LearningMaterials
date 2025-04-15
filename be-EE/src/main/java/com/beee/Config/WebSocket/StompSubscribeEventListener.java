//package com.beee.Config.WebSocket;
//
//import org.springframework.context.ApplicationListener;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.messaging.SessionSubscribeEvent;
//
//@Component
//public class StompSubscribeEventListener implements ApplicationListener<SessionSubscribeEvent> {
//
//	@Override
//	public void onApplicationEvent(SessionSubscribeEvent event) {
//		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
//
//		// Lấy username từ session attributes (đã set từ Interceptor)
//		String username = (String) accessor.getSessionAttributes().get("username");
//
//		// Lấy destination mà client subscribe tới
//		String destination = accessor.getDestination();
//
//		System.out.println("👤 " + username + " vừa SUBSCRIBE tới: " + destination);
//	}
//}