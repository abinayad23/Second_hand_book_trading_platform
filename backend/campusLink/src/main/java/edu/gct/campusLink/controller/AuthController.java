package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.AuthRequest;
import edu.gct.campusLink.config.JwtUtil;
import edu.gct.campusLink.service.OTPService;
import edu.gct.campusLink.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:5174"}, allowCredentials = "true")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final OTPService otpService;
    private final EmailService emailService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, 
                         JwtUtil jwtUtil,
                         OTPService otpService,
                         EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.otpService = otpService;
        this.emailService = emailService;
    }

    // ✅ Login + Generate Token
    @PostMapping("/login")
    public String login(@RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        if (authentication.isAuthenticated()) {
            String token = jwtUtil.generateToken(request.getEmail());
            return "✅ Login successful! Token: " + token;
        } else {
            return "❌ Invalid credentials!";
        }
    }

    // ✅ Validate Token
    @GetMapping("/validate")
    public String validateToken(@RequestParam String token) {
        boolean isValid = jwtUtil.validateToken(token);
        return isValid ? "✅ Token is valid!" : "❌ Invalid or expired token!";
    }

    // ✅ Send OTP for Registration
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOTP(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String phone = request.get("phone");
            Boolean useEmail = request.get("useEmail") != null ? 
                Boolean.parseBoolean(request.get("useEmail")) : true;

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }

            // Generate OTP
            System.out.println("DEBUG: Generating OTP for email: " + email);
            String otp = otpService.generateOTP(email);
            System.out.println("DEBUG: OTP generated: " + otp);

            // Send OTP via email
            if (useEmail) {
                System.out.println("DEBUG: Sending OTP via email service...");
                boolean sent = emailService.sendOTPEmail(email, otp);
                System.out.println("DEBUG: Email service returned: " + sent);
                if (sent) {
                    return ResponseEntity.ok(Map.of(
                        "message", "OTP sent successfully to " + email,
                        "success", true
                    ));
                } else {
                    return ResponseEntity.status(500).body(Map.of("error", "Failed to send OTP"));
                }
            } else {
                // SMS sending can be added here later
                return ResponseEntity.badRequest().body(Map.of("error", "SMS not implemented yet"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // ✅ Verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String phone = request.get("phone");
            String otp = request.get("otp");

            if (otp == null || otp.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "OTP is required"));
            }

            // Use email or phone as identifier
            String identifier = email != null && !email.trim().isEmpty() ? email : phone;
            if (identifier == null || identifier.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email or phone is required"));
            }

            // Verify OTP but don't remove it yet (will be removed during registration)
            // This allows the OTP to be used for registration after verification
            boolean isValid = otpService.verifyOTP(identifier, otp, false);

            if (isValid) {
                return ResponseEntity.ok(Map.of(
                    "message", "OTP verified successfully",
                    "success", true
                ));
            } else {
                return ResponseEntity.status(400).body(Map.of(
                    "error", "Invalid or expired OTP",
                    "success", false
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }
}
