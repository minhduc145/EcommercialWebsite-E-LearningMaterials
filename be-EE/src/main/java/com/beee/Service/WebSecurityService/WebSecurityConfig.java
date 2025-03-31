package com.beee.Service.WebSecurityService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.csrf((csrf) -> csrf.disable())
				.authorizeHttpRequests((requests) -> requests
						.requestMatchers("/users/login/oauth").authenticated()
						.anyRequest().permitAll()
				)
				.oauth2Login(oauth2 -> oauth2
						.defaultSuccessUrl("http://localhost:3000", true)
				)
				.logout(logout -> logout
						.logoutSuccessUrl("/").permitAll()
				);
		return http.build();
	}
}
