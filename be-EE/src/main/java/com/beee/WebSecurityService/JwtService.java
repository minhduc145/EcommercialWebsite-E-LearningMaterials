package com.beee.WebSecurityService;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {
	private final String SECRET_KEY_STRING;
	private final SecretKey SECRET_KEY;

	public JwtService() {
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		String secretKeyString = dotenv.get("JWT_SECRET_KEY");
		if (secretKeyString == null || secretKeyString.isEmpty()) {
			throw new IllegalArgumentException("JWT Secret Key không được để trống!");
		}
		this.SECRET_KEY_STRING = secretKeyString;
		this.SECRET_KEY = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKeyString));
		System.out.println(SECRET_KEY);
	}

	public String generateToken(String username) {
		return Jwts.builder()
				.setSubject(username)
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 giờ
				.signWith(SignatureAlgorithm.HS256, SECRET_KEY)
				.compact();
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

	private boolean isTokenExpired(String token) {
		return extractClaim(token, Claims::getExpiration).before(new Date());
	}
}
