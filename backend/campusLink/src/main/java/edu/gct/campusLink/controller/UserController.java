package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.AuthRequest;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.service.JwtService;
import edu.gct.campusLink.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            User user = userService.completeRegistration(request, otp);
            return ResponseEntity.ok(user);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            User user = userService.getUserByEmail(request.getEmail()).orElse(null);

            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
            }

            if (user.getIsVerified() == null || !user.getIsVerified()) {
                user.setIsVerified(true);
                userService.updateUser(user.getId(), user);
            }

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            String token = jwtService.generateToken(user);

            return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), user.getRole()));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid email or password", "message", "Please check your email and password"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    // ===========================
    // Secure get-by-ID endpoint
    // ===========================

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Forbidden"));
        }

        // Extract logged-in email from principal
        String loggedInEmail = auth.getName(); // works because UserDetails stores username here

        // Fetch YOUR User entity
        User principal = userService.getUserByEmail(loggedInEmail).orElse(null);
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Forbidden"));
        }

        boolean isAdmin = "ADMIN".equalsIgnoreCase(principal.getRole());
        boolean isOwner = principal.getId().equals(id);

        if (!isAdmin && !isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You are not allowed to access another user's data."));
        }

        var userOpt = userService.getUserById(id);

        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found"));
    }

    // ===========================
    // Secure get-by-email endpoint
    // ===========================

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Forbidden"));
        }

        String loggedInEmail = auth.getName();
        User principal = userService.getUserByEmail(loggedInEmail).orElse(null);
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Forbidden"));
        }

        boolean isAdmin = "ADMIN".equalsIgnoreCase(principal.getRole());
        boolean isOwner = principal.getEmail().equalsIgnoreCase(email);

        if (!isAdmin && !isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You are not allowed to access another user's data."));
        }

        var userOpt = userService.getUserByEmail(email);

        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found"));
    }

    // ===========================
    // /me — get logged-in user
    // ===========================

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        String loggedInEmail = auth.getName();
        User principal = userService.getUserByEmail(loggedInEmail).orElse(null);

        var userOpt = userService.getUserById(principal.getId());

        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found"));
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
