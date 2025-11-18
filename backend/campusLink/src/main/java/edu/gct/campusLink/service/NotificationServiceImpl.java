package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Notification;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.dao.NotificationRepository;
import edu.gct.campusLink.dao.UserRepository;
import edu.gct.campusLink.dto.NotificationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                   UserRepository userRepository,
                                   SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    @Transactional
    public Notification createNotification(Long userId, String title, String message, String type, Long referenceId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("User not found for id: " + userId);
        }

        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setMessage(message);
        n.setType(type);
        n.setReferenceId(referenceId);
        n.setRead(false);

        Notification saved = notificationRepository.save(n);

        // convert to DTO to prevent circular references
        NotificationDTO dto = toDto(saved);

        // push to WS topic for specific user
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, dto);

        return saved;
    }

    @Override
    public List<NotificationDTO> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<NotificationDTO> getUnreadNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByTimestampDesc(userId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NotificationDTO markAsRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        n.setRead(true);
        Notification saved = notificationRepository.save(n);
        return toDto(saved);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        var list = notificationRepository.findByUserIdAndIsReadFalseOrderByTimestampDesc(userId);
        list.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(list);
    }

    private NotificationDTO toDto(Notification n) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(n.getId());
        dto.setUserId(n.getUser() != null ? n.getUser().getId() : null);
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setRead(n.isRead());
        dto.setType(n.getType());
        dto.setReferenceId(n.getReferenceId());
        dto.setTimestamp(n.getTimestamp());
        return dto;
    }


    public void broadcastNotification(NotificationDTO dto) {
        messagingTemplate.convertAndSend("/topic/notifications", dto);
    }

    public String testNotify() {

        NotificationDTO dto = new NotificationDTO();
        dto.setUserId(2L);
        dto.setTitle("Test Notification");
        dto.setMessage("Hello from backend WebSocket!");
        dto.setType("INFO");

        messagingTemplate.convertAndSend("/topic/notifications/2", dto);

        return "sent";
    }

}
