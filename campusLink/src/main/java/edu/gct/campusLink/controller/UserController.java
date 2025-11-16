package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.AuthRequest;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.service.JwtService;
import edu.gct.campusLink.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:5174"}, allowCredentials = "true")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/initiate")
    public String initiate(@RequestBody AuthRequest request) {
        return userService.initiateRegistration(request);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtpAndRegister(@RequestBody AuthRequest request, @RequestParam String otp) {
        try {
            System.out.println("========================================");
            System.out.println("REGISTRATION REQUEST RECEIVED:");
            System.out.println("Email: " + request.getEmail());
            System.out.println("Name: " + request.getName());
            System.out.println("OTP: " + otp);
            System.out.println("========================================");
            
            User user = userService.completeRegistration(request, otp);
            
            System.out.println("✅ User saved to database with ID: " + user.getId());
            System.out.println("========================================");
            
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            System.err.println("❌ Registration failed: " + e.getMessage());
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            System.out.println("========================================");
            System.out.println("LOGIN ATTEMPT:");
            System.out.println("Email: " + request.getEmail());
            System.out.println("Password provided: " + (request.getPassword() != null ? "***" : "null"));
            System.out.println("========================================");
            
            // Check if user exists
            User user = userService.getUserByEmail(request.getEmail())
                    .orElse(null);
            
            if (user == null) {
                System.err.println("❌ User not found: " + request.getEmail());
                return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
            }
            
            // Check if user is verified
            if (user.getIsVerified() == null || !user.getIsVerified()) {
                System.err.println("❌ User not verified: " + request.getEmail());
                // Auto-verify user for now (for testing)
                user.setIsVerified(true);
                userService.updateUser(user.getId(), user);
                System.out.println("⚠️ Auto-verified user for login");
            }
            
            System.out.println("✅ User found: " + user.getName());
            System.out.println("✅ User verified: " + user.getIsVerified());
            System.out.println("Attempting authentication...");
            
            // Authenticate (this will check password)
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            System.out.println("✅ Authentication successful!");
            String token = jwtService.generateToken(user);
            System.out.println("Token generated successfully");
            System.out.println("========================================");

            return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), user.getRole()));
        } catch (AuthenticationException e) {
            System.err.println("❌ Authentication failed: " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password", "message", "Please check your email and password"));
        } catch (Exception e) {
            System.err.println("❌ Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id).orElseThrow();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        try {
            User user = userService.getUserByEmail(email).orElseThrow();
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @PutMapping("/{id}/edit")
    public User editProfile(@PathVariable Long id, @RequestBody User updatedUser) {
        return userService.updateUser(id, updatedUser);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testAuth() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", auth != null && auth.isAuthenticated());
        response.put("username", auth != null ? auth.getName() : "Not authenticated");
        response.put("authorities", auth != null ? auth.getAuthorities() : Collections.emptyList());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/debug/auth")
    public ResponseEntity<Map<String, Object>> debugAuth() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", auth != null && auth.isAuthenticated());
        response.put("username", auth != null ? auth.getName() : "Not authenticated");
        response.put("authorities", auth != null ? auth.getAuthorities() : Collections.emptyList());
        response.put("principal", auth != null ? auth.getPrincipal().getClass().getName() : "null");
        return ResponseEntity.ok(response);
    }

    // DTO for login response
    public static class LoginResponse {
        public String token;
        public String username;
        public String role;

        public LoginResponse(String token, String username, String role) {
            this.token = token;
            this.username = username;
            this.role = role;
        }
    }
}