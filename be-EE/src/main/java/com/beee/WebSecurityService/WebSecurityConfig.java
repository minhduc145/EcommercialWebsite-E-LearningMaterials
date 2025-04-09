package com.beee.WebSecurityService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.csrf((csrf) -> csrf.disable())
				.authorizeHttpRequests((requests) -> requests
						.anyRequest().permitAll()
				)
				.formLogin(form -> form
						.loginPage("http://localhost:3000/User/Login")  // Trang login tùy chỉnh
						.defaultSuccessUrl("/", true) // Chuyển hướng sau khi login thành công
						.permitAll()
				)
				.oauth2Login(oauth2 -> oauth2
						.defaultSuccessUrl("http://localhost:3000", true)
				)
				.logout(logout -> logout
						.logoutUrl("/api/accounts/logout")
						.invalidateHttpSession(true) // Xóa session
						.clearAuthentication(true)   // Xóa thông tin xác thực
						.deleteCookies("JSESSIONID") // Xóa cookie session (nếu có)
						.deleteCookies("jwt")
						.permitAll()
				);
		return http.build();
	}
}
