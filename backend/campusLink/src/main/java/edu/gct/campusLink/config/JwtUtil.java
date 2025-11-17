package edu.gct.campusLink.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String secret = "campuslink-secret-key-campuslink-secret-key-extended-for-hs256-algorithm-security";
    //private static final String  = "your-secret-key";
    //private final String secret = "your_secret_key_123456";
    // Explicitly use HS256 algorithm - ensure key is at least 256 bits (32 bytes)
    private final Key key = Keys.hmacShaKeyFor(secret.getBytes());

    // ✅ Generate Token
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 hours
                .signWith(key, SignatureAlgorithm.HS256) // Explicitly use HS256
                .compact();
    }

    // ✅ Extract email (subject)
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ✅ Validate Token (used in JwtFilter)
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            Claims claims = extractAllClaims(token);
            String email = claims.getSubject();

            return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (JwtException e) {
            System.out.println("❌ Invalid token: " + e.getMessage());
            return false;
        }
    }

    // ✅ Validate only token (used in /validate endpoint)
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            System.out.println("❌ Invalid token: " + e.getMessage());
            return false;
        }
    }

    // ✅ Check if token expired
    private boolean isTokenExpired(String token) {
        Date expiration = extractAllClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    // ✅ Extract all claims
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
