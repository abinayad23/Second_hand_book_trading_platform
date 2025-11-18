package edu.gct.campusLink.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class TestWsController {

    @MessageMapping("/test")     // Client sends to /app/test
    @SendTo("/topic/notifications/2")  // Will broadcast to subscribers
    public String sendTestMessage(String message) {
        System.out.println("Received from browser: " + message);
        return "Server reply: " + message;
    }
}
