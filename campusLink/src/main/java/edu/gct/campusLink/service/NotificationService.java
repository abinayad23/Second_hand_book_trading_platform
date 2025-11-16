package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Notification;
import java.util.List;

public interface NotificationService {
    void notifyUsersForBookAvailability(Long bookId);
    List<Notification> getAllNotifications(Long userId);
    List<Notification> getUnreadNotifications(Long userId);
    void markAsRead(Long notificationId);
    void markAllAsRead(Long userId);
}