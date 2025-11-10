package dev.secondhand.controller;

import dev.secondhand.model.User;
import dev.secondhand.repo.UserRepository;
import dev.secondhand.repo.ExternalUserApprovalsRepository;
import dev.secondhand.model.ExternalUserApproval;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository userRepo;
    private final ExternalUserApprovalsRepository approvalRepo;

    public AdminController(UserRepository userRepo, ExternalUserApprovalsRepository approvalRepo) {
        this.userRepo = userRepo;
        this.approvalRepo = approvalRepo;
    }

    @GetMapping("/pending-users")
    public ResponseEntity<?> pending() {
        List<User> list = userRepo.findAll().stream().filter(u -> u.getStatus() == User.Status.PENDING_APPROVAL).toList();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/approve/{userId}")
    public ResponseEntity<?> approve(@PathVariable Long userId, @RequestBody Map<String,String> body) {
        User u = userRepo.findById(userId).orElse(null);
        if (u == null) return ResponseEntity.notFound().build();
        String roll = body.get("rollNo");
        String name = body.get("fullName");
        String dob = body.get("dob");
        boolean ok = (roll != null && roll.equalsIgnoreCase(u.getRollNo())) || (name != null && name.equalsIgnoreCase(u.getFullName()));
        if (dob != null && u.getDob() != null) {
            ok = ok && LocalDate.parse(dob).isEqual(u.getDob());
        }
        if (ok) {
            u.setStatus(User.Status.ACTIVE);
            userRepo.save(u);
            ExternalUserApproval a = new ExternalUserApproval();
            a.setUserId(userId);
            a.setApproved(true);
            approvalRepo.save(a);
            return ResponseEntity.ok(Map.of("message","approved"));
        }
        return ResponseEntity.badRequest().body(Map.of("message","details did not match"));
    }
}