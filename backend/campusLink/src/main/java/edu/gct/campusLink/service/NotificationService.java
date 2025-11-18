package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Notification;
import edu.gct.campusLink.dto.NotificationDTO;

import java.util.List;

public interface NotificationService {
    Notification createNotification(Long userId, String title, String message, String type, Long referenceId);
    List<NotificationDTO> getNotificationsForUser(Long userId);
    List<NotificationDTO> getUnreadNotificationsForUser(Long userId);
    NotificationDTO markAsRead(Long notificationId);
    void markAllAsRead(Long userId);

    public String testNotify();

    void broadcastNotification(NotificationDTO dto);
}
