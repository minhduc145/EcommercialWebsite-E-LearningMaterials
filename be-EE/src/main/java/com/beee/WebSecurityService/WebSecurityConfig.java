package com.beee.WebSecurityService;

import com.beee.Common.Constants;
import com.beee.Config.GoogleRequestResolver;
import com.beee.Model.AccountModel;
import com.beee.Repository.AccountRepo;
import com.beee.Service.ResponseService;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.client.OAuth2LoginConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;

import java.io.IOException;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
	@Autowired
	ResponseService responseService;
	@Autowired
	AccountRepo accountRepo;
	@Autowired
	JwtService jwtService;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, InMemoryClientRegistrationRepository clientRegistrationRepository) throws Exception {
		http
				.csrf((csrf) -> csrf.disable())
				.authorizeHttpRequests((requests) -> requests
						.anyRequest().permitAll()
				)
				.oauth2Login(oauth2 -> oauth2
						.authorizationEndpoint(authorization -> authorization
								.authorizationRequestResolver(
										new GoogleRequestResolver(
												clientRegistrationRepository,
												"/oauth2/authorization"
										)
								))
						.successHandler((request, response, authentication) -> {
							OAuth2User principal = (OAuth2User) authentication.getPrincipal();
							AccountModel accountModel = accountRepo.findAccountModelByUser_Email(principal.getAttribute("email").toString());
							if (accountModel != null) {
								responseService.addCookie(response, "jwt", jwtService.generateToken(accountModel.getId()));
								response.sendRedirect(Constants.URL_FE_LOGIN_SUCCESS);
							} else {
								response.sendRedirect(Constants.URL_FE_LOGIN_FAIL);
							}
						})
				)
				.logout(logout -> logout
						.logoutUrl("/api/accounts/logout")
						.invalidateHttpSession(true)
						.clearAuthentication(true)
						.deleteCookies("JSESSIONID")
						.deleteCookies("jwt")
						.permitAll()
				);
		http
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				);

		return http.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}
