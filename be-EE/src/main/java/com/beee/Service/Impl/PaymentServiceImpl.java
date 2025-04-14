package com.beee.Service.Impl;

import com.beee.Config.VnpayConfig;
import com.beee.Service.PaymentService;
import com.beee.WebSecurityService.JwtService;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
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


	public String createPaymentUrl(String username, long amount, String orderInfo, String ipAddress) throws UnsupportedEncodingException {
		Map<String, String> vnpParams = new HashMap<>();
		vnpParams.put("vnp_Version", "2.1.0");
		vnpParams.put("vnp_Command", "pay");
		vnpParams.put("vnp_TmnCode", vnpayConfig.getTmnCode());
		vnpParams.put("vnp_Amount", String.valueOf(amount * 100)); //must multiply by 100
		vnpParams.put("vnp_CurrCode", "VND");
		vnpParams.put("vnp_TxnRef", jwtService.generateToken(username + "~~" + orderInfo, 900000));
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
}
