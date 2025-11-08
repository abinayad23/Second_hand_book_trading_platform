package dev.secondhand.controller;

import dev.secondhand.model.User;
import dev.secondhand.security.JwtUtil;
import dev.secondhand.service.UserService;
import dev.secondhand.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, UserRepository userRepository, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String fullName = body.get("fullName");
        String rollNo = body.get("rollNo");
        String dob = body.get("dob");

        if (email == null || password == null) return ResponseEntity.badRequest().body(Map.of("message","email and password required"));
        if (userRepository.findByEmail(email).isPresent()) return ResponseEntity.badRequest().body(Map.of("message","email already registered"));

        User u = new User();
        u.setEmail(email);
        u.setPasswordHash(password);
        u.setFullName(fullName);
        u.setRollNo(rollNo);
        if (dob != null && !dob.isEmpty()) {
            u.setDob(LocalDate.parse(dob));
        }
        boolean active = email.toLowerCase().endsWith("@gct.ac.in");
        userService.register(u, active);

        if (active) {
            String token = jwtUtil.generateToken(email);
            return ResponseEntity.ok(Map.of("message","registered","token",token));
        }
        return ResponseEntity.ok(Map.of("message","registered_pending_approval"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            var userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) return ResponseEntity.status(401).body(Map.of("message","invalid credentials"));
            User u = userOpt.get();
            if (u.getStatus() != User.Status.ACTIVE) return ResponseEntity.status(403).body(Map.of("message","account not active"));
            String token = jwtUtil.generateToken(email);
            return ResponseEntity.ok(Map.of("token", token, "user", Map.of("email", u.getEmail(), "fullName", u.getFullName())));
        } catch (Exception ex) {
            return ResponseEntity.status(401).body(Map.of("message","invalid credentials"));
        }
    }
}