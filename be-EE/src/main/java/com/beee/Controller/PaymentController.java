package com.beee.Controller;

import com.beee.Service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
	@Autowired
	private PaymentService paymentService;

	@GetMapping("/vnpay")
	public ResponseEntity<String> createPaymentUrl(
			@RequestParam long amount,
			@RequestParam String orderInfo,
			HttpServletRequest request
	) throws UnsupportedEncodingException {
		String ipAddress = request.getRemoteAddr();
		String paymentUrl = paymentService.createPaymentUrl(amount, orderInfo, ipAddress);
		return ResponseEntity.ok(paymentUrl);
	}
}
