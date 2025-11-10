package dev.secondhand.controller;

import dev.secondhand.model.Notification;
import dev.secondhand.repo.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationRepository repo;
    public NotificationController(NotificationRepository repo) { this.repo = repo; }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam Long userId) {
        List<Notification> list = repo.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/mark-read/{id}")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        return repo.findById(id).map(n -> { n.setReadFlag(true); repo.save(n); return ResponseEntity.ok(n); })
                .orElse(ResponseEntity.notFound().build());
    }
}