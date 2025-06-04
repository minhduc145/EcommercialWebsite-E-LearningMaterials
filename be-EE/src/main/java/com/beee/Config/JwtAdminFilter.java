package com.beee.Config;

import com.beee.Common.Constants;
import com.beee.Model.AccountModel;
import com.beee.Repository.AccountRepo;
import com.beee.Service.Impl.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
@Component
public class JwtAdminFilter extends OncePerRequestFilter {
	private static final String COOKIE_NAME = "jwt";
	private final JwtService jwtService;
	private final AccountRepo accountRepo;

	public JwtAdminFilter(JwtService jwtService, AccountRepo accountRepo) {
		this.jwtService = jwtService;
		this.accountRepo = accountRepo;
	}


	private String extractTokenFromCookies(HttpServletRequest request) {
		if (request.getCookies() == null) return null;
		return Arrays.stream(request.getCookies())
				.filter(c -> COOKIE_NAME.equals(c.getName()))
				.map(Cookie::getValue)
				.findFirst()
				.orElse(null);
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
		String path = request.getRequestURI();
		if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
			filterChain.doFilter(request, response);
			return;
		}
		if (path.startsWith("/api/admin")) {
			String token = extractTokenFromCookies(request);
			if (token == null || !StringUtils.hasText(token) || jwtService.isTokenExpired(token)) {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				return;
			} else {
				AccountModel account = accountRepo.findAccountModelById(jwtService.extractUsername(token));
				if (account == null || account.getIsLocked() || !account.getRole().equals(Constants.ROLE_ADMIN)) {
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					return;
				}
			}
		}
		filterChain.doFilter(request, response);
	}
}