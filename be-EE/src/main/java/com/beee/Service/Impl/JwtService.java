package com.beee.Service.Impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtService implements com.beee.Service.JwtService {
	private final String SECRET_KEY_STRING;
	private final SecretKey SECRET_KEY;

	public JwtService(@Value("${jwt.secret-key}") String secretKey) {
		if (secretKey == null || secretKey.isEmpty()) {
			throw new IllegalArgumentException("Jwt key is null");
		}
		this.SECRET_KEY_STRING = secretKey;
		this.SECRET_KEY = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY_STRING));
	}

	public String generateToken(String username, long expireMillis) {
		return Jwts.builder()
				.setSubject(username)
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + expireMillis)) //a day
				.signWith(SignatureAlgorithm.HS256, SECRET_KEY)
				.compact();
	}

	public String generateToken(String username) {
		return generateToken(username, 86400000); // 1 ngày
	}

	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parser()
				.setSigningKey(SECRET_KEY)
				.build()
				.parseClaimsJws(token)
				.getBody();
	}

	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String username = extractUsername(token);
		return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}

	public boolean isTokenExpired(String token) {
		return extractClaim(token, Claims::getExpiration).before(new Date());
	}

	public String generateToken(String username, String otp, long expireMillis) {
		return Jwts.builder()
				.setSubject(username)
				.claim("otp", otp)
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + expireMillis))
				.signWith(SignatureAlgorithm.HS256, SECRET_KEY)
				.compact();
	}

	public String generateToken(String username, String otp) {
		return generateToken(username, otp, 86400000); // 1 ngày
	}
	public String extractOtp(String token) {
		return extractClaim(token, claims -> claims.get("otp", String.class));
	}

	public String extractOTPId(String token) {
		return extractClaim(token, Claims::getSubject);
	}

}
