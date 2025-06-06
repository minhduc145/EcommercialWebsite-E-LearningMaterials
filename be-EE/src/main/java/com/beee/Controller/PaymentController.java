package com.beee.Controller;

import com.beee.DTO.VnpayPaymentResponseDTO;

import com.beee.Service.PaymentService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@Controller
@RequestMapping("/api/payment")
public class PaymentController {
	@Autowired
	private PaymentService paymentService;

	@ResponseBody
	@GetMapping("/vnpay")
	public ResponseEntity<String> createPaymentUrl(
			@CookieValue(name = "jwt", required = false) String jwt,
			@RequestParam long amount,
			@RequestParam String orderInfo,
			HttpServletRequest request, HttpServletResponse response
	) throws UnsupportedEncodingException {
	return paymentService.getPaymentUrl(jwt,amount,orderInfo,request,response);
	}

	@GetMapping("/return")
	public String test(VnpayPaymentResponseDTO responseDTO, HttpServletRequest request, HttpServletResponse response,
	                   @CookieValue(name = "jwt", required = false) String token,
	                   @CookieValue(name = "payment", required = false) String paymentToken) {
		return paymentService.handlePaymentResult(responseDTO,request,response,token,paymentToken);
	}

}
