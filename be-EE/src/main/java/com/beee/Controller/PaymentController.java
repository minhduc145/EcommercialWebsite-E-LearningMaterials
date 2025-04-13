package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Config.VnpayConfig;
import com.beee.DTO.VnpayPaymentResponseDTO;
import com.beee.Service.PaymentService;
import com.beee.Service.RabbitMQProducer;
import com.beee.WebSecurityService.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.web.firewall.RequestRejectedException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.*;

@Controller
@RequestMapping("/api/payment")
public class PaymentController {
	@Autowired
	private PaymentService paymentService;
	@Autowired
	private VnpayConfig vnpayConfig;
	@Autowired
	RabbitMQProducer rabbitMQProducer;
	@Autowired
	private JwtService jwtService;

	@ResponseBody
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

	@ResponseBody
	@GetMapping("/return")
	public String test(VnpayPaymentResponseDTO responseDTO, HttpServletRequest request, @CookieValue(name = "jwt", required = false) String token) {
		String username = jwtService.extractUsername(token);
		Map<String, String> fields = new HashMap<>();
		for (String key : request.getParameterMap().keySet()) {
			if (key.startsWith("vnp_") && !key.equals("vnp_SecureHash")) {
				fields.put(key, request.getParameter(key));
			}
		}
		String vnp_SecureHash = responseDTO.getVnp_SecureHash();
		String signValue = paymentService.hashAllFields(fields, vnpayConfig.getHashSecret());
		if (signValue.equals(vnp_SecureHash)) {
			String vnp_ResponseCode = fields.get("vnp_ResponseCode");
			if ("00".equals(vnp_ResponseCode)) {
				rabbitMQProducer.sendToQ2(username, Constants.RESULT_SUCCESS.toString());
			} else {
				rabbitMQProducer.sendToQ2(username, Constants.RESULT_FAIL.toString());
			}
		} else {
			rabbitMQProducer.sendToQ2(username, Constants.RESULT_FAIL.toString());
			System.out.println("Dữ liệu không hợp lệ");
		}
		rabbitMQProducer.sendToQ1(username, "Bạn đã thực hiện 1 giao dịch");
		return "Done. Close this popup!";
	}
}
