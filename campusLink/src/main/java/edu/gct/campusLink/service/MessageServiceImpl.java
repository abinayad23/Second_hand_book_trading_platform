package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Message;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.dao.MessageRepository;
import edu.gct.campusLink.dao.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageServiceImpl(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Message sendMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);

        return messageRepository.save(message);
    }

    @Override
    public List<Message> getConversation(Long user1Id, Long user2Id) {
        return messageRepository.getConversationBetween(user1Id, user2Id);
    }
}