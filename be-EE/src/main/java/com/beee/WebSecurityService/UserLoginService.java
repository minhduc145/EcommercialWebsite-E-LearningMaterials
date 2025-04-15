package com.beee.WebSecurityService;

import com.beee.Common.Constants;
import com.beee.Model.AccountModel;
import com.beee.Model.UserModel;
import com.beee.Repository.AccountRepo;
import com.beee.Repository.UserRepo;
import com.beee.Service.ResponseService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.io.IOException;
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

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(10);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		AccountModel accountModel = accountRepo.findByIdOrUser_Email(username, username);
		if (accountModel == null) throw new UsernameNotFoundException("User not found");
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
			responseService.addCookie(response, "jwt", jwtService.generateToken(accountModel.getId()));
			response.sendRedirect(Constants.URL_FE_LOGIN_SUCCESS);
		} else {
			System.out.println(principal);
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
			userRepo.save(newUserModel);
			responseService.addCookie(response, "jwt", jwtService.generateToken(newUserModel.getId()));
			response.sendRedirect(Constants.URL_FE_LOGIN_SUCCESS);
		}
	}

}

