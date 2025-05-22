package com.beee.Service;

import com.beee.Common.Constants;
import com.beee.Model.AccountModel;
import com.beee.Model.UserModel;
import com.beee.Repository.AccountRepo;
import com.beee.Repository.UserRepo;
import com.beee.Service.Impl.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class UserLoginService implements UserDetailsService {
	@Autowired
	private AccountRepo accountRepo;
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private JwtService jwtService;
	@Autowired
	private ResponseService responseService;
	@Autowired
	private S3Service s3Service;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(10);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		AccountModel accountModel = accountRepo.findByIdOrUser_Email(username, username);
		if (accountModel == null) throw new AuthenticationServiceException("Tài khoản không tồn tại");
		if (accountModel.getIsLocked()) throw new AuthenticationServiceException("Tài khoản bị tạm khóa");
		UserDetails user = User.builder()
				.username(accountModel.getId())
				.password(accountModel.getPassword())
				.roles(accountModel.getRole())
				.build();
		return user;
	}

	public void oauth2LoginHandler(HttpServletResponse response, Authentication authentication) throws IOException {

		OAuth2User principal = (OAuth2User) authentication.getPrincipal();
		AccountModel accountModel = accountRepo.findAccountModelByUser_Email(principal.getAttribute("email"));
		if (accountModel != null) {
			if (accountModel.getIsLocked()) response.sendRedirect(Constants.URL_FE_LOGIN_FAIL_LOCKED);
			else {
				responseService.addCookie(response, "jwt", jwtService.generateToken(accountModel.getId()));
				response.sendRedirect(Constants.URL_FE_LOGIN_SUCCESS);
			}
		} else {
			UserModel newUserModel = new UserModel().builder()
					.id(principal.getAttribute("sub"))
					.email(principal.getAttribute("email"))
					.avatarUrl(principal.getAttribute("picture"))
					.firstName(principal.getAttribute("given_name"))
					.lastName(principal.getAttribute("family_name"))
					.build();
			AccountModel newAccountModel = new AccountModel().builder()
					.provider("google")
					.role(Constants.ROLE_USER)
					.user(newUserModel)
					.build();
			newUserModel.setAccount(newAccountModel);
			String r2AvatarUrl = uploadAvatarToR2(newUserModel.getAvatarUrl());
			newUserModel.setAvatarUrl(r2AvatarUrl == null ? "" : r2AvatarUrl);
			userRepo.save(newUserModel);
			responseService.addCookie(response, "jwt", jwtService.generateToken(newUserModel.getId()));
			response.sendRedirect(Constants.URL_FE_LOGIN_SUCCESS);
		}

	}

	String uploadAvatarToR2(String rawUrl) {
		try {
			Path uploadPath = Paths.get("uploads");
			Files.createDirectories(uploadPath);
			String originalFileName = rawUrl.substring(rawUrl.lastIndexOf("/") + 1);
			String extension = originalFileName.contains(".")
					? originalFileName.substring(originalFileName.lastIndexOf("."))
					: "";
			String uuidFileName = UUID.randomUUID().toString() + extension;
			Path filePath = uploadPath.resolve(uuidFileName);
			try (InputStream in = new URL(rawUrl).openStream()) {
				Files.copy(in, filePath, StandardCopyOption.REPLACE_EXISTING);
			}
			File file = filePath.toFile();
			String key = "avatars/" + uuidFileName;
			System.out.println(extension);
			s3Service.uploadFileSDK(file, key);
			Files.deleteIfExists(filePath);
			return Constants.CLOUD_URL_PUBLIC + "/" + key;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}

