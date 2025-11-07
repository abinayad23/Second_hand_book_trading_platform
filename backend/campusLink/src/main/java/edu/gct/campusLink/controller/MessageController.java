package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.Message;
import edu.gct.campusLink.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/send")
    public Message sendMessage(@RequestParam Long senderId,
                               @RequestParam Long receiverId,
                               @RequestParam String content) {
        return messageService.sendMessage(senderId, receiverId, content);
    }

    @GetMapping("/conversation")
    public List<Message> getConversation(@RequestParam Long user1Id,
                                         @RequestParam Long user2Id) {
        return messageService.getConversation(user1Id, user2Id);
    }
}