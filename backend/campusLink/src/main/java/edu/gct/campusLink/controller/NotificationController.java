package edu.gct.campusLink.controller;

import edu.gct.campusLink.dto.NotificationDTO;
import edu.gct.campusLink.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:5174"}, allowCredentials = "true")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<NotificationDTO>> getAll(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId));
    }

    @GetMapping("/{userId}/unread")
    public ResponseEntity<List<NotificationDTO>> getUnread(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotificationsForUser(userId));
    }

    @PostMapping("/mark-read/{id}")
    public ResponseEntity<NotificationDTO> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PostMapping("/{userId}/mark-all-read")
    public ResponseEntity<Map<String, String>> markAllRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
    @PostMapping("/test-broadcast")
    public ResponseEntity<String> testBroadcast(@RequestBody NotificationDTO dto) {

        notificationService.broadcastNotification(dto); // call STOMP broadcast

        return ResponseEntity.ok("Broadcasted");
    }

    @GetMapping("/test-notify")
    public String testNotify() {

        return notificationService.testNotify();
    }


}
