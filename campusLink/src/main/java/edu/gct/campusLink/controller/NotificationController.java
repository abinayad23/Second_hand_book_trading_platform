package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.Notification;
import edu.gct.campusLink.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/unread")
    public List<Notification> getUnread(@RequestParam Long userId) {
        return notificationService.getUnreadNotifications(userId);
    }

    @PutMapping("/read/{id}")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }
}
