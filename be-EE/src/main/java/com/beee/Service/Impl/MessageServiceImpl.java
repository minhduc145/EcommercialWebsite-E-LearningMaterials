package com.beee.Service.Impl;

import com.beee.Service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class MessageServiceImpl implements MessageService {
	@Autowired
	private JavaMailSender mailSender;

	public void sendSimpleEmail(String to, String subject, String text) {
		try {
			SimpleMailMessage message = new SimpleMailMessage();
			message.setFrom("hethongeedu@demomailtrap.co");
			message.setTo(to);
			message.setSubject(subject);
			message.setText(text);
			mailSender.send(message);
		} catch (MailException e) {
			e.printStackTrace();
		}
	}
}
