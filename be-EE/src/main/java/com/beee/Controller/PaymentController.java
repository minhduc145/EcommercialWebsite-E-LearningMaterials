package com.beee.Controller;

import ch.qos.logback.core.model.Model;
import com.beee.Common.Constants;
import com.beee.Config.VnpayConfig;
import com.beee.DTO.VnpayPaymentResponseDTO;
import com.beee.Service.PaymentService;
import com.beee.Service.RabbitMQProducer;
import com.beee.Service.ResponseService;
import com.beee.WebSecurityService.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
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
	@Autowired
	private ResponseService responseService;

	@GetMapping("/hihi")
	public String hihi(Model model) {
		return "course-runner";
	}
	@ResponseBody
	@GetMapping("/vnpay")
	public ResponseEntity<String> createPaymentUrl(
			@CookieValue(name = "jwt", required = false) String jwt,
			@RequestParam long amount,
			@RequestParam String orderInfo,
			HttpServletRequest request, HttpServletResponse response
	) throws UnsupportedEncodingException {
		if (jwt != null && !jwtService.isTokenExpired(jwt)) {
			String username = jwtService.extractUsername(jwt);
			String ipAddress = request.getRemoteAddr();
			String paymentUrl = paymentService.createPaymentUrl(username, amount, orderInfo, ipAddress);
			responseService.addCookie(response, "payment", jwtService.generateToken(username + "~~" + orderInfo, 900000));
			return ResponseEntity.ok(paymentUrl);
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@GetMapping("/return")
	public String test(VnpayPaymentResponseDTO responseDTO, HttpServletRequest request, HttpServletResponse response,
	                   @CookieValue(name = "jwt", required = false) String token,
	                   @CookieValue(name = "payment", required = false) String paymentToken) {
		if (!jwtService.isTokenExpired(paymentToken)) {
			String username = jwtService.extractUsername(token);
			Map<String, String> fields = new HashMap<>();
			for (String key : request.getParameterMap().keySet()) {
				if (key.startsWith("vnp_") && !key.equals("vnp_SecureHash")) {
					fields.put(key, request.getParameter(key));
				}
			}
			String[] secureInfo = jwtService.extractUsername(paymentToken).split("~~");
			responseService.disposeCookie(response, "payment");
			if (secureInfo.length > 1) {
				String orderInfo1 = responseDTO.getVnp_OrderInfo();
				String orderInfo2 = secureInfo[1];
				String username2 = secureInfo[0];
				if (username2.equals(username) && orderInfo1.equals(orderInfo2)) {
					String signValue = paymentService.hashAllFields(fields, vnpayConfig.getHashSecret());
					String vnp_SecureHash = responseDTO.getVnp_SecureHash();
					if (signValue.equals(vnp_SecureHash)) {
						String vnp_ResponseCode = fields.get("vnp_ResponseCode");
						if ("00".equals(vnp_ResponseCode)) {
							rabbitMQProducer.sendToQ2(username, Constants.RESULT_SUCCESS.toString());
						} else {
							rabbitMQProducer.sendToQ2(username, Constants.RESULT_FAIL.toString());
						}
					} else {
						rabbitMQProducer.sendToQ2(username, Constants.RESULT_FAIL.toString());
						return "Failed. Data is missing";
					}
					rabbitMQProducer.sendToQ1(username, "Bạn đã thực hiện 1 giao dịch");
					return "redirect:" + Constants.URL_FE_PAYMENT_SUCCESS;
				}
			}
		}
		return "Failed. Data is missing";
	}
}
