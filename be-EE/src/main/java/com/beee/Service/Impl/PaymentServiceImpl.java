package com.beee.Service.Impl;

import com.beee.Common.Constants;
import com.beee.Config.VnpayConfig;
import com.beee.DTO.VnpayPaymentResponseDTO;
import com.beee.Model.CourseModel;
import com.beee.Model.SubscriptionModel;
import com.beee.Model.UserModel;
import com.beee.Model.VnpayTransactionLogModel;
import com.beee.Repository.CourseRepo;
import com.beee.Repository.PaymentRepo;
import com.beee.Repository.SubscriptionRepo;
import com.beee.Repository.UserRepo;
import com.beee.Service.PaymentService;
import com.beee.Service.QueueService;
import com.beee.Service.RabbitMQProducer;
import com.beee.Service.ResponseService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestParam;


import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PaymentServiceImpl implements PaymentService {
	@Autowired
	private VnpayConfig vnpayConfig;
	@Autowired
	private JwtService jwtService;
	@Autowired
	private ResponseService responseService;
	@Autowired
	private CourseRepo courseRepo;
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private RabbitMQProducer rabbitMQProducer;
	@Autowired
	private QueueService queueService;
	@Autowired
	private SubscriptionRepo subscriptionRepo;
	@Autowired
	private PaymentRepo paymentRepo;

	public String createPaymentUrl(String username, long amount, String orderInfo, String ipAddress) throws UnsupportedEncodingException {
		Map<String, String> vnpParams = new HashMap<>();
		vnpParams.put("vnp_Version", "2.1.0");
		vnpParams.put("vnp_Command", "pay");
		vnpParams.put("vnp_TmnCode", vnpayConfig.getTmnCode());
		vnpParams.put("vnp_Amount", String.valueOf(amount * 100)); //must multiply by 100
		vnpParams.put("vnp_CurrCode", "VND");
		vnpParams.put("vnp_TxnRef", UUID.randomUUID().toString());
		vnpParams.put("vnp_OrderInfo", orderInfo);
		vnpParams.put("vnp_OrderType", "other");
		vnpParams.put("vnp_Locale", "vn");
		vnpParams.put("vnp_ReturnUrl", vnpayConfig.getReturnUrl());
		vnpParams.put("vnp_IpAddr", ipAddress);
		vnpParams.put("vnp_CreateDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));

		List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
		Collections.sort(fieldNames);
		StringBuilder hashData = new StringBuilder();
		StringBuilder query = new StringBuilder();

		for (String fieldName : fieldNames) {
			String value = vnpParams.get(fieldName);
			if ((value != null) && (value.length() > 0)) {
				hashData.append(fieldName).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII)).append('&');
				query.append(fieldName).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII)).append('&');
			}
		}

		hashData.setLength(hashData.length() - 1);
		query.setLength(query.length() - 1);

		String secureHash = HmacSHA512(vnpayConfig.getHashSecret(), hashData.toString());
		return vnpayConfig.getPayUrl() + "?" + query + "&vnp_SecureHash=" + secureHash;
	}

	private String HmacSHA512(String key, String data) {
		try {
			Mac hmac512 = Mac.getInstance("HmacSHA512");
			SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "HmacSHA512");
			hmac512.init(secretKey);
			byte[] bytes = hmac512.doFinal(data.getBytes());
			return Hex.encodeHexString(bytes).toLowerCase();
		} catch (Exception e) {
			throw new RuntimeException("Error while generating HMAC-SHA512", e);
		}
	}

	//for Controlller
	public String hashAllFields(Map<String, String> fields, String hashSecret) {
		List<String> fieldNames = new ArrayList<>(fields.keySet());
		Collections.sort(fieldNames);
		StringBuilder hashData = new StringBuilder();
		for (String fieldName : fieldNames) {
			String fieldValue = fields.get(fieldName);
			if ((fieldValue != null) && (fieldValue.length() > 0)) {
				hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII)).append('&');
			}
		}
		hashData.setLength(hashData.length() - 1);
		return HmacSHA512(hashSecret, hashData.toString());
	}

	@Override
	public void paymentSuccessHandler() {
		return;
	}

	public ResponseEntity<String> getPaymentUrl(String jwt, long amount, String orderInfo, HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException {
		if (jwt != null && !jwtService.isTokenExpired(jwt)) {
			String username = jwtService.extractUsername(jwt);
			if (amount == 0) {
				Integer courseId = Integer.parseInt(orderInfo.split("_")[1]);
				setSubscription(username, courseId, 0);
				rabbitMQProducer.sendToQ2(username, Constants.RESULT_SUCCESS.toString());
				return ResponseEntity.ok().build();
			}
			String ipAddress = request.getRemoteAddr();
			String paymentUrl = this.createPaymentUrl(username, amount, orderInfo, ipAddress);
			responseService.addCookie(response, "payment", jwtService.generateToken(username + "~~" + orderInfo, 900000));
			return ResponseEntity.ok(paymentUrl);
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	;


	public String handlePaymentResult(VnpayPaymentResponseDTO responseDTO, HttpServletRequest request, HttpServletResponse response, String token, String paymentToken) {
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
					String signValue = this.hashAllFields(fields, vnpayConfig.getHashSecret());
					String vnp_SecureHash = responseDTO.getVnp_SecureHash();
					if (signValue.equals(vnp_SecureHash)) {
						String vnp_ResponseCode = fields.get("vnp_ResponseCode");
						long vnp_Amount = Long.parseLong(fields.get("vnp_Amount"));
						boolean isSubSuccess = "00".equals(vnp_ResponseCode) && setSubscription(username, Integer.parseInt(orderInfo1.split("_")[1]), vnp_Amount);
						if (isSubSuccess) {
							CourseModel c = courseRepo.findCourseModelById(Integer.parseInt(orderInfo1.split("_")[1]));
							UserModel u = userRepo.findUserModelById(username);
							savePaymentLogs(fields, u.getId(), c.getId(), false);
							rabbitMQProducer.sendToQ2(username, Constants.RESULT_SUCCESS.toString());
							queueService.sendEmailQueue(Map.of("email", u.getEmail(), "title", "Xác nhận mua học liệu thành công ở hệ thông eEdu.", "message", "Thư này được gửi để xác nhận rằng bạn đã thanh toán thành công học liệu " + c.getTitle()));
							return "redirect:" + Constants.URL_FE_PAYMENT_SUCCESS;
						} else {
							rabbitMQProducer.sendToQ2(username, Constants.RESULT_FAIL.toString());
							return "redirect:" + Constants.URL_FE_PAYMENT_FAIL;
						}
					} else {
						rabbitMQProducer.sendToQ2(username, Constants.RESULT_FAIL.toString());
						return "Failed. Data is missing";
					}
				}
			}
		}
		return "Failed. Data is missing";
	}

	boolean setSubscription(String username, Integer courseId, long amount) {
		CourseModel course = courseRepo.findCourseModelById(courseId);
		if (course != null) {
			SubscriptionModel subscriptionModel = new SubscriptionModel();
			subscriptionModel.setUser(UserModel.builder().id(username).build());
			subscriptionModel.setCourse(course);
			subscriptionModel.setBoughtPrice(BigDecimal.valueOf(amount / 100));
			subscriptionModel.setIsAvailable(true);
			subscriptionRepo.save(subscriptionModel);
			return true;
		}
		return false;
	}

	void savePaymentLogs(Map<String, String> fields, String userId, Integer courseId, boolean isReturnType) {
		try {
			System.out.println(fields);
			String responseCode = fields.get("vnp_ResponseCode");
			VnpayTransactionLogModel model = VnpayTransactionLogModel.builder()
					.paymentId(fields.get("vnp_TransactionNo"))
					.user(UserModel.builder().id(userId).build())
					.course(CourseModel.builder().id(courseId).build())
					.bankCode(fields.getOrDefault("vnp_BankCode", "..."))
					.createdAt(LocalDateTime.now())
					.amount(BigDecimal.valueOf(Long.parseLong(fields.get("vnp_Amount").toString()) / 100))
					.description(fields.get("vnp_OrderInfo"))
					.isSuccessful(responseCode.equals("00") ? true : false)
					.isReturnType(isReturnType)
					.promoteAmount(BigDecimal.valueOf(Long.parseLong(fields.getOrDefault("vnp_PromotionAmount", "0").toString())))
					.responseCode(responseCode)
					.build();
			paymentRepo.save(model);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
