package com.beee.Service;

import org.springframework.stereotype.Service;

@Service
public interface MessageService {
	public void sendSimpleEmail(String to, String subject, String text);
}
