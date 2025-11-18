package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Message;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.dao.MessageRepository;
import edu.gct.campusLink.dao.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public MessageServiceImpl(MessageRepository messageRepository,
                              UserRepository userRepository,
                              NotificationService notificationService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    public Message sendMessage(Long senderId, Long receiverId, String content) {

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setTimestamp(java.time.LocalDateTime.now());
        message.setRead(false);

        Message saved = messageRepository.save(message);

        // ---- Trigger Notification ----
        notificationService.createNotification(
                receiver.getId(),
                "New Message",
                "New message from " + sender.getName(),
                "MESSAGE",
                saved.getId()
        );

        return saved;
    }

    @Override
    public List<Message> getConversation(Long user1Id, Long user2Id) {
        return messageRepository.findConversation(user1Id, user2Id);
    }

    @Override
    public List<Message> getMessagesBySender(Long senderId) {
        return messageRepository.findBySenderId(senderId);
    }

    @Override
    public List<Message> getMessagesByReceiver(Long receiverId) {
        return messageRepository.findByReceiverId(receiverId);
    }

    @Override
    @Transactional
    public void markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setRead(true);
        messageRepository.save(message);
    }

    @Override
    @Transactional
    public void markConversationAsRead(Long user1Id, Long user2Id) {
        List<Message> messages = messageRepository.findConversation(user1Id, user2Id);

        for (Message message : messages) {
            if (message.getReceiver().getId().equals(user1Id)) {
                message.setRead(true);
            }
        }

        messageRepository.saveAll(messages);
    }
}
