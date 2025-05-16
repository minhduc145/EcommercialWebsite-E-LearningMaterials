package com.beee.Controller;

import com.beee.Common.Constants;
import com.beee.Common.Utils;
import com.beee.DTO.UserLoginFormDTO;
import com.beee.DTO.UserRegisterFormDTO;
import com.beee.Model.AccountModel;
import com.beee.Model.UserModel;
import com.beee.Repository.AccountRepo;
import com.beee.Repository.UserRepo;
import com.beee.Service.AccountService;
import com.beee.Service.ResponseService;
import com.beee.Service.S3Service;
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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

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
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private AccountService accountService;
	@Autowired
	private S3Service s3Service;

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
			return ResponseEntity.ok(Utils.mapOfResponse(Constants.RESULT_SUCCESS, "Đăng nhập thành công", null));
		} catch (AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Utils.mapOfResponse(Constants.RESULT_FAIL, "Sai tài khoản/ mật khẩu", null));
		}
	}

	@PostMapping("/signup")
	public ResponseEntity signup(@Valid @RequestBody UserRegisterFormDTO formBody) {
		if (userRepo.existsByIdOrEmail(formBody.getUsername(), formBody.getEmail())) {
			return ResponseEntity.of(Optional.of(Utils.mapOfResponse(Constants.RESULT_FAIL, "failed", "Username hoặc Email đã được sử dụng")));
		} else {
			AccountModel account = AccountModel.builder()
					.password(passwordEncoder.encode(formBody.getPassword()))
					.provider("default")
					.role("USER")
					.build();

			UserModel user = UserModel.builder()
					.id(formBody.getUsername())
					.firstName(formBody.getFirstName())
					.lastName(formBody.getLastName())
					.email(formBody.getEmail())
					.phone(formBody.getPhone())
					.account(account)
					.build();

			account.setUser(user);
			userRepo.save(user);
		}
		return ResponseEntity.of(Optional.of(Utils.mapOfResponse(Constants.RESULT_SUCCESS, "ok", formBody)));
	}

	@PostMapping("/get_user_login_info_by_cookie")
	public ResponseEntity getUserInfo(@CookieValue(name = "jwt", required = false) String token, HttpServletResponse response) {
		if (StringUtils.hasText(token)) {
			if (jwtService.isTokenExpired(token)) {
				responseService.disposeCookie(response, "jwt");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Utils.mapOfResponse(Constants.RESULT_FAIL, "Chưa đăng nhập", null));
			}
			String username = jwtService.extractUsername(token);
			UserModel user = userRepo.findUserModelById(username);
			System.out.println(user);
			return ResponseEntity.ok(user);
		}
		return ResponseEntity.ok().build();
	}

	@PostMapping("/isAdmin")
	public ResponseEntity isAdmin(@CookieValue(name = "jwt", required = false) String token, HttpServletResponse response) {
		if (!accountService.isJwtOk(token)) {
			responseService.disposeCookie(response, "jwt");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
		}
		String username = jwtService.extractUsername(token);
		return ResponseEntity.ok().body(accountRepo.existsByIdAndRole(username, "ADMIN"));
	}

	@PostMapping("/profile/edit")
	public ResponseEntity editProfile(@CookieValue(name = "jwt") String userToken, @Valid @ModelAttribute UserModel userModel,
	                                  @RequestParam(name = "avatarFile", required = false) MultipartFile avatarFile) {
		if (accountService.isJwtOk(userToken)) {
			String username = jwtService.extractUsername(userToken);
			if (username.equals(userModel.getId()) || accountService.isAdminJwtOk(userToken)) {
				UserModel user = userRepo.findUserModelById(userModel.getId());
				if (userModel.getPhone() != null && !user.getPhone().equals(userModel.getPhone())) {
					if (!accountRepo.existsByUser_Phone((userModel.getPhone())))
						user.setPhone(userModel.getPhone());
					else
						return ResponseEntity.of(Optional.of(Utils.mapOfResponse(Constants.RESULT_FAIL, "failed", "SĐT đã được sử dụng")));

				}
				if (!user.getEmail().equals(userModel.getEmail())) {
					if (!accountRepo.existsByUser_Email(userModel.getEmail()))
						user.setEmail(userModel.getEmail());
					else
						return ResponseEntity.of(Optional.of(Utils.mapOfResponse(Constants.RESULT_FAIL, "failed", "Email đã được sử dụng")));

				}
				user.setFirstName(userModel.getFirstName());
				user.setLastName(userModel.getLastName());
				if (avatarFile != null) {
					s3Service.deleteObject(user.getAvatarUrl().replace(Constants.CLOUD_URL_PUBLIC + "/", ""));
					String key = "avatars/" + UUID.randomUUID().toString();
					try {
						s3Service.uploadFileViaSignedUrl(avatarFile, key);
						user.setAvatarUrl(Constants.CLOUD_URL_PUBLIC + "/" + key);
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
				userRepo.save(user);
				return ResponseEntity.ok(Utils.mapOfResponse(Constants.RESULT_SUCCESS, "ok", user));
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}


}
