package edu.gct.campusLink.config;

import edu.gct.campusLink.service.CustomUserDetailsService;
import edu.gct.campusLink.service.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.apache.catalina.core.ApplicationContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
    private final JwtUtil jwtUtil;
    //private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, java.io.IOException {

        String path = request.getRequestURI();
        
        // Skip authentication for public endpoints
        if (path.equals("/api/auth/login") || 
            path.equals("/api/users/login") || 
            path.equals("/api/users/register") ||
            path.equals("/api/users/initiate") ||
            path.equals("/api/users/verify") ||
            path.equals("/api/auth/send-otp") ||
            path.equals("/api/auth/verify-otp")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                email = jwtUtil.extractEmail(token);
                System.out.println("🔍 Extracted email from token: " + email);
            } catch (JwtException e) {
                System.out.println("❌ Error extracting email from token: " + e.getMessage());
                email = null;
            }
        } else {
            System.out.println("⚠️ No Authorization header found for path: " + path);
        }
        
        if (email != null && token != null) {
            try {
                // Always try to validate and set authentication if token is present
                var userDetails = userDetailsService.loadUserByUsername(email);
                
                // Check if user is enabled
                if (!userDetails.isEnabled()) {
                    System.out.println("❌ User account is disabled (not verified): " + email);
                    // Don't set authentication - let Spring Security block with 403
                    SecurityContextHolder.clearContext();
                } else if (jwtUtil.validateToken(token, userDetails)) {
                    var authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, 
                        null, 
                        userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("✅ Authentication set for: " + email + " on path: " + path);
                } else {
                    System.out.println("❌ Token validation failed for: " + email);
                    // Don't set authentication - let Spring Security block with 403
                    SecurityContextHolder.clearContext();
                }
            } catch (Exception e) {
                System.out.println("❌ Error loading user details for " + email + ": " + e.getMessage());
                e.printStackTrace();
                // Don't set authentication - let Spring Security block with 403
                SecurityContextHolder.clearContext();
            }
        } else {
            // No token provided for protected endpoint
            System.out.println("⚠️ No valid token found for protected path: " + path);
            // Don't set authentication - let Spring Security block with 403
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
    
}