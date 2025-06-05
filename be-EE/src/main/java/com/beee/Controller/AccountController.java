package com.beee.Controller;

import com.beee.DTO.UserLoginFormDTO;
import com.beee.DTO.UserRegisterFormDTO;
import com.beee.Model.UserModel;
import com.beee.Service.AccountService;
import com.beee.Service.MessageService;
import com.beee.Service.QueueService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
class AccountController {
	@Autowired
	private AccountService accountService;
	@Autowired
	private QueueService queueService;

	@GetMapping("/test")
	public void test() {
		queueService.sendEmailQueue(Map.of("email", "ducle140503@gmail.com", "title", "Khôi phục mật khẩu cho hệ thống eEdu", "message", "Mật khẩu xác nhận"));
	}

	@GetMapping("/passwordRequest")
	public ResponseEntity<String> passwordRequest(@CookieValue(name = "resetToken", required = false) String resetToken, @CookieValue(name = "usn", required = false) String usn) {
		if (!StringUtils.hasText(resetToken) && !StringUtils.hasText(usn))
		{String otp = String.format("%04d", (int) (Math.random() * 10000));}
		return null;
	}

	@PostMapping("/login")
	public ResponseEntity login(@RequestBody UserLoginFormDTO loginFormDTO, HttpServletResponse response) {
		return accountService.login(loginFormDTO, response);
	}

	@PostMapping("/signup")
	public ResponseEntity signup(@Valid @RequestBody UserRegisterFormDTO formBody) {
		return accountService.signup(formBody);
	}

	@PostMapping("/get_user_login_info_by_cookie")
	public ResponseEntity getUserInfo(@CookieValue(name = "jwt", required = false) String token, HttpServletResponse response) {
		return accountService.getUserInfo(token, response);
	}

	@PostMapping("/profile/edit")
	public ResponseEntity editProfile(@RequestParam MultiValueMap<String, String> formData, @CookieValue(name = "jwt") String userToken, @Valid @ModelAttribute UserModel userModel,
	                                  @RequestParam(name = "avatarFile", required = false) MultipartFile avatarFile) {
		return accountService.editProfile(formData, userToken, userModel, avatarFile);
	}

	@PostMapping("/password/edit")
	public ResponseEntity editPassword(@CookieValue(name = "jwt") String userToken, @RequestBody Map<String, String> formData) {
		return accountService.editPassword(userToken, formData);
	}
}

