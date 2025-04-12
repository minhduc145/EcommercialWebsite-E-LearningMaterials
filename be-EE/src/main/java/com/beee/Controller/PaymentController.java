package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Config.VnpayConfig;
import com.beee.DTO.VnpayPaymentResponseDTO;
import com.beee.Service.PaymentService;
import com.beee.Service.RabbitMQConsumer;
import com.beee.Service.RabbitMQProducer;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

	@ExceptionHandler(RequestRejectedException.class)
	public void rejected(HttpServletResponse response, HttpServletRequest request) throws IOException {
		System.out.println("rejected");
		System.out.println(request.getRequestURI());
	}

	@ResponseBody
	@GetMapping("/return")
	public String test(VnpayPaymentResponseDTO responseDTO, HttpServletRequest request) {
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
				System.out.println("result Thành công");
				rabbitMQProducer.sendMessage(Constants.RESULT_SUCCESS.toString());
			} else {
				System.out.println("result That bai");
				rabbitMQProducer.sendMessage(Constants.RESULT_FAIL.toString());
			}
		} else {
			rabbitMQProducer.sendMessage(Constants.RESULT_FAIL.toString());
			System.out.println("Dữ liệu không hợp lệ");
		}
		return "Done. Close this popup!";
	}
}
