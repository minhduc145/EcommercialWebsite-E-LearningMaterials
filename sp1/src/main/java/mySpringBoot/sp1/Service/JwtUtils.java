//package mySpringBoot.sp1.Services;
//
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Component;
//
//import java.security.Key;
//import java.util.Date;
//import java.util.Set;
//import java.util.function.Function;
//
//@Component
//public class JwtUtils {
//    private final String SECRET_KEY = "your-secret-key-your-secret-key"; // Ít nhất 32 ký tự
//    private final long EXPIRATION_TIME = 86400000; // 1 ngày
//
//
//    private Key getSigningKey() {
//        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
//    }
//    public String generateToken(String userId) {
//        return Jwts.builder()
//                .setSubject(userId)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
//                .compact();
//    }
//    public String generateToken(String userId, Set<String> roles) {
//        return Jwts.builder()
//                .setSubject(userId)
//                .claim("roles", roles)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    public boolean validateToken(String token) {
//        try {
//            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
//            return true;
//        } catch (JwtException e) {
//            return false;
//        }
//    }
//
//    public String extractUserId(String token) {
//        return extractClaim(token, Claims::getSubject);
//    }
//
//    public Set<String> extractRoles(String token) {
//        Claims claims = extractAllClaims(token);
//        return claims.get("roles", Set.class);
//    }
//
//    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
//        final Claims claims = extractAllClaims(token);
//        return claimsResolver.apply(claims);
//    }
//
//    private Claims extractAllClaims(String token) {
//        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
//                .parseClaimsJws(token).getBody();
//    }
//}
//
