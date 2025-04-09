package com.beee.Service;

import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
public interface PaymentService {
	public String createPaymentUrl(long amount, String orderInfo, String ipAddress) throws UnsupportedEncodingException;
}
