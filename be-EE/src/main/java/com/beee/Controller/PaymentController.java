package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Config.VnpayConfig;
import com.beee.DTO.VnpayPaymentResponseDTO;
import com.beee.Model.CourseModel;
import com.beee.Model.SubscriptionModel;
import com.beee.Model.UserModel;
import com.beee.Model.VnpayTransactionLogModel;
import com.beee.Repository.*;
import com.beee.Service.PaymentService;
import com.beee.Service.QueueService;
import com.beee.Service.RabbitMQProducer;
import com.beee.Service.ResponseService;
import com.beee.Service.Impl.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
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
	@Autowired
	private CourseRepo courseRepo;
	@Autowired
	private SubscriptionRepo subscriptionRepo;
	@Autowired
	private QueueService queueService;
	@Autowired
	private AccountRepo accountRepo;
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private PaymentRepo paymentRepo;

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
			if (amount == 0) {
				Integer courseId = Integer.parseInt(orderInfo.split("_")[1]);
				setSubscription(username, courseId, 0);
				rabbitMQProducer.sendToQ2(username, Constants.RESULT_SUCCESS.toString());
				return ResponseEntity.ok().build();
			}
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
						long vnp_Amount = Long.parseLong(fields.get("vnp_Amount"));
						boolean isSubSuccess = "00".equals(vnp_ResponseCode) && setSubscription(username, Integer.parseInt(orderInfo1.split("_")[1]), vnp_Amount);
						if (isSubSuccess) {
							CourseModel c = courseRepo.findCourseModelById(Integer.parseInt(orderInfo1.split("_")[1]));
							UserModel u = userRepo.findUserModelById(username);
							savePaymentLogs(fields,u.getId(),c.getId(),false);
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
					.amount(BigDecimal.valueOf(Long.parseLong(fields.get("vnp_Amount").toString())/100))
					.description(fields.get("vnp_OrderInfo"))
					.isSuccessful(responseCode.equals("00")?true:false)
					.isReturnType(isReturnType)
					.promoteAmount(BigDecimal.valueOf(Long.parseLong(fields.getOrDefault("vnp_PromotionAmount","0").toString())))
					.responseCode(responseCode)
					.build();
			paymentRepo.save(model);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
