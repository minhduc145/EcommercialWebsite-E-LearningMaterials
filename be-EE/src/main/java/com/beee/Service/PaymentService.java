package com.beee.Service;

import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Map;

@Service
public interface PaymentService {
	public String createPaymentUrl(long amount, String orderInfo, String ipAddress) throws UnsupportedEncodingException;

	public String hashAllFields(Map<String, String> fields, String hashSecret);

	public void paymentSuccessHandler();
}
