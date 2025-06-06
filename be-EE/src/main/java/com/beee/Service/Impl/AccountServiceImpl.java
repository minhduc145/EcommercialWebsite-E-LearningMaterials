package com.beee.Service.Impl;

import com.beee.Common.Constants;
import com.beee.Common.Utils;
import com.beee.DTO.UserDTO;
import com.beee.DTO.UserLoginFormDTO;
import com.beee.DTO.UserRegisterFormDTO;
import com.beee.Model.AccountModel;
import com.beee.Model.UserModel;
import com.beee.Repository.AccountRepo;
import com.beee.Repository.UserRepo;
import com.beee.Service.AccountService;
import com.beee.Service.ResponseService;
import com.beee.Service.S3Service;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AccountServiceImpl implements AccountService {
	private final JwtService jwtService;
	private final AccountRepo accountRepo;
	private final ResponseService responseService;
	private final AuthenticationManager authenticationManager;
	private final UserRepo userRepo;
	private final PasswordEncoder passwordEncoder;
	private final S3Service s3Service;

	public AccountServiceImpl(JwtService jwtService, AccountRepo accountRepo, ResponseService responseService, AuthenticationManager authenticationManager, UserRepo userRepo, PasswordEncoder passwordEncoder,  S3Service s3Service) {
		this.jwtService = jwtService;
		this.accountRepo = accountRepo;
		this.responseService = responseService;
		this.authenticationManager = authenticationManager;
		this.userRepo = userRepo;
		this.passwordEncoder = passwordEncoder;
		this.s3Service = s3Service;
	}

	public boolean isJwtOk(String jwtToken) {
		try {
			return jwtToken != null && !jwtService.isTokenExpired(jwtToken);
		} catch (Exception e) {
			return false;
		}
	}

	public boolean isAdminJwtOk(String jwtToken) {
		if (!isJwtOk(jwtToken))
			return false;
		try {
			String username = jwtService.extractUsername(jwtToken);
			return username != null && accountRepo.existsByIdAndRole(username, Constants.ROLE_ADMIN);
		} catch (Exception e) {
			return false;
		}
	}

	public ResponseEntity login(UserLoginFormDTO loginFormDTO, HttpServletResponse response) {
		responseService.disposeCookie(response, "jwt");
		try {
			Authentication auth = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginFormDTO.getId().toLowerCase().trim(), loginFormDTO.getPassword())
			);
			User user = (User) auth.getPrincipal();
			if (user != null) {
				String token = jwtService.generateToken(user.getUsername());
				responseService.addCookie(response, "jwt", token);
				return ResponseEntity.ok(Utils.mapOfResponse(Constants.RESULT_SUCCESS, "Đăng nhập thành công", null));
			}
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Utils.mapOfResponse(Constants.RESULT_FAIL, "Lỗi", null));
		} catch (AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Utils.mapOfResponse(Constants.RESULT_FAIL, e.getMessage(), null));
		}
	}

	public ResponseEntity signup(UserRegisterFormDTO formBody) {
		if (userRepo.existsByIdOrEmail(formBody.getUsername(), formBody.getEmail())) {
			return ResponseEntity.of(Optional.of(Utils.mapOfResponse(Constants.RESULT_FAIL, "failed", "Username hoặc Email đã được sử dụng")));
		} else if (userRepo.existsByPhone(formBody.getPhone())) {
			return ResponseEntity.of(Optional.of(Utils.mapOfResponse(Constants.RESULT_FAIL, "failed", "SĐT đã được sử dụng")));
		} else {
			AccountModel account = AccountModel.builder()
					.password(passwordEncoder.encode(formBody.getPassword()))
					.provider("default")
					.role("USER")
					.isLocked(false)
					.build();

			UserModel user = UserModel.builder()
					.id(formBody.getUsername())
					.firstName(formBody.getFirstName())
					.lastName(formBody.getLastName())
					.email(formBody.getEmail())
					.phone(formBody.getPhone())
					.birthdate(formBody.getBirthdate())
					.isMale(formBody.getIsMale().equals("true"))
					.account(account)
					.build();

			account.setUser(user);
			userRepo.save(user);
		}
		return ResponseEntity.of(Optional.of(Utils.mapOfResponse(Constants.RESULT_SUCCESS, "ok", formBody)));
	}

	public ResponseEntity editProfile(MultiValueMap<String, String> formData, String userToken, UserModel userModel, MultipartFile avatarFile) {
		if (this.isJwtOk(userToken)) {
			String username = jwtService.extractUsername(userToken);
			if (username.equals(userModel.getId()) || this.isAdminJwtOk(userToken)) {
				UserModel user = userRepo.findUserModelById(userModel.getId());
				 if (user.getPhone()==null || !user.getPhone().equals(userModel.getPhone())) {
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
				String date = formData.get("birthDate").get(0);
				user.setBirthdate(LocalDate.parse(date));
				user.setMale(formData.get("isMale").get(0).equals("true"));
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

	public ResponseEntity editPassword(String userToken, Map<String, String> formData) {
		if (this.isJwtOk(userToken)) {
			if (jwtService.extractUsername(userToken).equals(formData.get("userId")) || this.isAdminJwtOk(userToken)) {
				String username = formData.get("userId");
				String oldPassword = formData.getOrDefault("oldPassword", "");
				String newPassword = formData.get("newPassword");
				String confirmPassword = formData.get("confirmPassword");
				AccountModel acc = accountRepo.getById(username);
				if (!passwordEncoder.matches(oldPassword, acc.getPassword())) {
					return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Utils.mapOfResponse(Constants.RESULT_FAIL, "Sai mật khẩu hiện tại", null));
				}
				if (!newPassword.equals(confirmPassword)) {
					return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Utils.mapOfResponse(Constants.RESULT_FAIL, "Mật khẩu xác nhận không khớp mk mới", null));
				}
				acc.setPassword(passwordEncoder.encode(newPassword));
				accountRepo.save(acc);
				return ResponseEntity.status(HttpStatus.OK).build();
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	public ResponseEntity getUserInfo(String token, HttpServletResponse response) {
		if (StringUtils.hasText(token)) {
			if (jwtService.isTokenExpired(token)) {
				responseService.disposeCookie(response, "jwt");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Utils.mapOfResponse(Constants.RESULT_FAIL, "Chưa đăng nhập", null));
			}
			String username = jwtService.extractUsername(token);
			UserModel user = userRepo.findUserModelById(username);
			UserDTO userDTO = new UserDTO().toDto(user, true);
			System.out.println(userDTO);
			return ResponseEntity.ok(userDTO);
		}
		return ResponseEntity.ok().build();
	}
}
