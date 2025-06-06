package com.beee.Service;

import com.beee.DTO.VnpayPaymentResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Map;

@Service
public interface PaymentService {
	public String createPaymentUrl(String username, long amount, String orderInfo, String ipAddress) throws UnsupportedEncodingException;

	public String hashAllFields(Map<String, String> fields, String hashSecret);

	public void paymentSuccessHandler();

	public ResponseEntity<String> getPaymentUrl(String jwt, long amount, String orderInfo, HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException;


	public String handlePaymentResult(VnpayPaymentResponseDTO responseDTO, HttpServletRequest request, HttpServletResponse response, String token, String paymentToken);

}
