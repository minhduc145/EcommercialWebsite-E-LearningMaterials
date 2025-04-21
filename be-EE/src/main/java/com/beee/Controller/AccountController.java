package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Common.Utils;
import com.beee.DTO.UserLoginFormDTO;
import com.beee.DTO.UserRegisterFormDTO;
import com.beee.Model.AccountModel;
import com.beee.Model.UserModel;
import com.beee.Repository.AccountRepo;
import com.beee.Repository.UserRepo;
import com.beee.Service.ResponseService;
import com.beee.WebSecurityService.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private ResponseService responseService;
	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private JwtService jwtService;
	@Autowired
	private AccountRepo accountRepo;

	@PostMapping("/login")
	public ResponseEntity login(@RequestBody UserLoginFormDTO loginFormDTO, HttpServletResponse response) {
		responseService.disposeCookie(response, "jwt");
		try {
			Authentication auth = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginFormDTO.getId().toLowerCase().trim(), loginFormDTO.getPassword())
			);
			User user = (User) auth.getPrincipal();
			String token = jwtService.generateToken(user.getUsername());
			responseService.addCookie(response, "jwt", token);
			return ResponseEntity.ok(Utils.mapOfResponse(Constants.RESULT_SUCCESS, "Đăng nhập thành công"));
		} catch (AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Utils.mapOfResponse(Constants.RESULT_FAIL, "Sai tài khoản/ mật khẩu"));
		}
	}

	@PostMapping("/signup")
	public ResponseEntity signup(@Valid @RequestBody UserRegisterFormDTO formBody) {
		Map response = new HashMap<String, Object>();
		response.put("code", "1");
		response.put("user", formBody);
		return ResponseEntity.of(Optional.of(response));
	}

	@PostMapping("/get_user_login_info_by_cookie")
	public ResponseEntity getUserInfo(@CookieValue(name = "jwt", required = false) String token, HttpServletResponse response) {
		if (token == null || jwtService.isTokenExpired(token)) {
			responseService.disposeCookie(response, "jwt");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Utils.mapOfResponse(Constants.RESULT_FAIL, "Chưa đăng nhập"));
		}
		String username = jwtService.extractUsername(token);
		UserModel user = userRepo.findUserModelById(username);
		System.out.println(user);
		return ResponseEntity.ok(user);
	}

	@PostMapping("/isAdmin")
	public ResponseEntity isAdmin(@CookieValue(name = "jwt", required = false) String token, HttpServletResponse response) {
		if (token == null || jwtService.isTokenExpired(token)) {
			responseService.disposeCookie(response, "jwt");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
		}
		String username = jwtService.extractUsername(token);
		return ResponseEntity.ok().body(accountRepo.existsByIdAndRole(username, "ADMIN"));
	}
}
