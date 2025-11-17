package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Message;
import java.util.List;

public interface MessageService {
    Message sendMessage(Long senderId, Long receiverId, String content);
    List<Message> getConversation(Long user1Id, Long user2Id);
    List<Message> getMessagesBySender(Long senderId);
    List<Message> getMessagesByReceiver(Long receiverId);
    void markAsRead(Long messageId);
    void markConversationAsRead(Long user1Id, Long user2Id);
}

