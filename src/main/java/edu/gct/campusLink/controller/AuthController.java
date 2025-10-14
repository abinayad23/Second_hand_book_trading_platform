package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        Optional<User> existing = userService.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Email already used");
        }
        // TODO: hash password
        User saved = userService.register(user);
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User login) {
        Optional<User> opt = userService.findByEmail(login.getEmail());
        if (opt.isEmpty()) return ResponseEntity.status(401).body("Invalid credentials");
        User u = opt.get();
        if (!u.getPassword().equals(login.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        u.setPassword(null);
        return ResponseEntity.ok(u);
    }
}