package com.beee.Service;

import org.springframework.stereotype.Service;

@Service
public interface JwtService {
	public String generateToken(String username, long expireMillis);

	public String generateToken(String username);

	public String extractUsername(String token);


	public boolean isTokenExpired(String token);
}
