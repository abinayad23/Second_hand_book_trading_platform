package dev.secondhand.controller;

import dev.secondhand.model.ChatMessage;
import dev.secondhand.model.ChatThread;
import dev.secondhand.repo.ChatMessageRepository;
import dev.secondhand.repo.ChatThreadRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatThreadRepository threadRepo;
    private final ChatMessageRepository msgRepo;
    private final SimpMessagingTemplate messaging;

    public ChatController(ChatThreadRepository threadRepo, ChatMessageRepository msgRepo, SimpMessagingTemplate messaging) {
        this.threadRepo = threadRepo;
        this.msgRepo = msgRepo;
        this.messaging = messaging;
    }

    // create or fetch thread
    @PostMapping("/threads")
    public ChatThread getOrCreateThread(@RequestBody ChatThread req) {
        Optional<ChatThread> found = threadRepo.findByBookIdAndBuyerIdAndSellerId(req.getBookId(), req.getBuyerId(), req.getSellerId());
        if (found.isPresent()) return found.get();
        req.setCreatedAt(LocalDateTime.now());
        return threadRepo.save(req);
    }

    @MessageMapping("/thread.send")
    public void handleMessage(ChatMessageDto dto) {
        ChatMessage msg = new ChatMessage();
        msg.setThreadId(dto.getThreadId());
        msg.setSenderId(dto.getSenderId());
        msg.setMessage(dto.getMessage());
        msg.setCreatedAt(LocalDateTime.now());
        msgRepo.save(msg);
        // broadcast to subscribers of the thread
        messaging.convertAndSend("/topic/thread." + dto.getThreadId(), msg);
    }

    public static class ChatMessageDto {
        private Long threadId;
        private Long senderId;
        private String message;
        // getters/setters
        public Long getThreadId() { return threadId; }
        public void setThreadId(Long threadId) { this.threadId = threadId; }
        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}