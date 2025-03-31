package com.beee.Controller;

import com.beee.DTO.UserRegisterFormDTO;
import com.beee.Model.AccountModel;
import com.beee.Model.UserModel;
import com.beee.Repository.AccountRepo;
import com.beee.Repository.UserRepo;
import com.beee.Service.WebSecurityService.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private AccountRepo accountRepo;

	@Autowired
	private JwtService jwtService;

	BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

	@PostMapping("/login")
	public ResponseEntity login(@Valid @RequestBody AccountModel accountModel, HttpServletResponse response) {
		Map<String, Object> responseBody = new HashMap<>();
		AccountModel resultAccountModel = accountRepo.findAccountModelById(accountModel.getId());
		if (resultAccountModel != null && encoder.matches(accountModel.getPassword(), resultAccountModel.getPassword())) {
			String token = jwtService.generateToken(accountModel.getId());
			System.out.println(token);
			Cookie cookie = new Cookie("jwt", token);
			cookie.setHttpOnly(true);
			cookie.setPath("/");
			cookie.setMaxAge(60 * 60 * 24); // 1 ngày
			response.addCookie(cookie);
			responseBody.put("code", "1");
			responseBody.put("user", resultAccountModel);
			return ResponseEntity.ok().body(responseBody);
		}
		responseBody.put("code", "0");
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseBody);
	}

	@PostMapping("/signup")
	public ResponseEntity signup(@Valid @RequestBody UserRegisterFormDTO formBody) {
		Map response = new HashMap<String, Object>();
		response.put("code", "1");
		response.put("user", formBody);
		return ResponseEntity.of(Optional.of(response));
	}

	@GetMapping("/all")
	public List<UserModel> getAllUsers() {
		return userRepo.findAll();
	}

	@GetMapping("/me")
	public ResponseEntity getUserInfo(@CookieValue(name = "jwt", required = false) String token) {
		if (token == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa đăng nhập");
		}
		String username = jwtService.extractUsername(token);
		System.out.println("usn: "+username);
		UserModel user = userRepo.findUserModelById(username);
		return ResponseEntity.ok(user);
	}
}
