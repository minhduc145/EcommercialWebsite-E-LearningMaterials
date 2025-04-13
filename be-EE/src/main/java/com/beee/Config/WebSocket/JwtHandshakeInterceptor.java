package com.beee.Config.WebSocket;

import com.beee.WebSecurityService.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {
	@Autowired
	JwtService jwtService;

	@Override
	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
	                               WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

		HttpServletRequest httpRequest = ((ServletServerHttpRequest) request).getServletRequest();
		String token = null;

		if (httpRequest.getCookies() != null) {
			for (Cookie cookie : httpRequest.getCookies()) {
				if (cookie.getName().equals("jwt")) {
					token = cookie.getValue();
					break;
				}
			}
		}

		if (token != null && !token.isEmpty()) {
			try {
				String username = jwtService.extractUsername(token);  // Giải mã JWT lấy username
				attributes.put("username", username);
			} catch (Exception e) {
				System.out.println("Invalid JWT: " + e.getMessage());
			}
		}
		System.out.println("JWT: " + token);

		return true;
	}

	@Override
	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
	                           Exception exception) {
	}
}