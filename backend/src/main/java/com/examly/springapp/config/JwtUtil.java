package com.examly.springapp.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

/**
 * JWT issuing/validation per Appendix D:
 * - HS256, minimum 256-bit secret loaded from environment config
 * - Role-specific expiry (regular users 8h, staff 12h, admins 24h)
 * - Simple in-memory blacklist for logout/breach events (swap for Redis in production)
 */
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    private final Set<String> blacklist = new HashSet<>();

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    private long expiryMillisForRole(String role) {
        if ("ADMIN".equalsIgnoreCase(role)) return 24L * 60 * 60 * 1000;      // 24h
        if ("COMMUNITY_MANAGER".equalsIgnoreCase(role)
                || "MODERATOR".equalsIgnoreCase(role)
                || "EVENT_ORGANISER".equalsIgnoreCase(role)) return 12L * 60 * 60 * 1000; // 12h
        return 8L * 60 * 60 * 1000; // 8h regular users
    }

    public String generateToken(Long userId, String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", role);
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiryMillisForRole(role));
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    public Long extractUserId(String token) {
        Object v = extractAllClaims(token).get("userId");
        return v == null ? null : ((Number) v).longValue();
    }

    public boolean isTokenValid(String token, String expectedEmail) {
        if (blacklist.contains(token)) return false;
        String email = extractEmail(token);
        return email.equals(expectedEmail) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    public void blacklist(String token) {
        blacklist.add(token);
    }

    public boolean isBlacklisted(String token) {
        return blacklist.contains(token);
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
