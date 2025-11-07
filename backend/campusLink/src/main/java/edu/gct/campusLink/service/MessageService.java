package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Message;
import java.util.List;

public interface MessageService {
    Message sendMessage(Long senderId, Long receiverId, String content);
    List<Message> getConversation(Long user1Id, Long user2Id);
}