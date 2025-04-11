package com.beee.Service;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public interface ResponseService {
	void addCookie(HttpServletResponse response, String cookieName, String value);
	void disposeCookie(HttpServletResponse response, String cookieName);
}
