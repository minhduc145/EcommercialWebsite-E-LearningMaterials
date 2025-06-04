package com.beee.Service.Impl;

import com.beee.Service.ResponseService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public class ResponseServiceImpl implements ResponseService {
	@Override
	public void addCookie(HttpServletResponse response, String cookieName, String value) {
		Cookie cookie = new Cookie(cookieName, value);
		cookie.setHttpOnly(true);
		cookie.setSecure(false); // để false nếu không dùng HTTPS
		cookie.setPath("/");
		cookie.setMaxAge(60 * 60 * 24); // a day
		response.addCookie(cookie);
	}

	@Override
	public void disposeCookie(HttpServletResponse response, String cookieName) {
		Cookie cookie = new Cookie(cookieName, null);
		cookie.setMaxAge(0);
		cookie.setPath("/");
		response.addCookie(cookie);
	}
}
