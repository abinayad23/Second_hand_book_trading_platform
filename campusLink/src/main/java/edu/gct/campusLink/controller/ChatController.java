package edu.gct.campusLink.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.gct.campusLink.bean.ChatMessage;

@RestController 
@RequestMapping("/lost-found/")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:5174", "http://localhost:3515"}, allowCredentials = "true")
public class ChatController {
	@Autowired
    private SimpMessagingTemplate messagingTemplate;
 
    // Online users
    private final Set<String> onlineUsers = Collections.synchronizedSet(new HashSet<>());
 
    // Map sessionId -> username for disconnect handling
    private final Map<String, String> sessionIdToUser = Collections.synchronizedMap(new HashMap<>());
 
    // ------------------------
    // REST endpoint to check current users (optional)
    // ------------------------
    @GetMapping("/users")
    public Set<String> getOnlineUsers() {
        return onlineUsers;
    }
 
    // ------------------------
    // WebSocket: register user
    // ------------------------
    @MessageMapping("/register")
    public void register(ChatMessage message, org.springframework.messaging.simp.stomp.StompHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        String username = message.getSender();
        if (username != null && !username.trim().isEmpty()) {
            onlineUsers.add(username);
            sessionIdToUser.put(sessionId, username);
            broadcastUserList();
        }
    }
 
    // ------------------------
    // WebSocket: send message
    // ------------------------
    @MessageMapping("/sendMessage")
    public void sendMessage(ChatMessage message) {
        messagingTemplate.convertAndSend("/topic/messages", message);
    }
 
    // ------------------------
    // Optional: remove user on disconnect
    // ------------------------
    public void removeUser(String sessionId) {
        String username = sessionIdToUser.get(sessionId);
        if (username != null) {
            onlineUsers.remove(username);
            sessionIdToUser.remove(sessionId);
            broadcastUserList();
        }
    }
 
    // ------------------------
    // Broadcast updated user list
    // ------------------------
    private void broadcastUserList() {
        messagingTemplate.convertAndSend("/topic/users", onlineUsers);
    }
}
