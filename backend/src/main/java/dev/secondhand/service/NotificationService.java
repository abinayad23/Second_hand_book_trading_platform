package dev.secondhand.service;

import com.sendgrid.*;
import dev.secondhand.model.Notification;
import dev.secondhand.repo.NotificationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.io.IOException;

@Service
public class NotificationService {
    private final NotificationRepository repo;
    private final SimpMessagingTemplate messaging;
    @Value("${sendgrid.api-key:}") private String sendGridApiKey;

    public NotificationService(NotificationRepository repo, SimpMessagingTemplate messaging) {
        this.repo = repo;
        this.messaging = messaging;
    }

    public Notification create(Long userId, String type, String payload, String emailTo, String emailSubject) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setType(type);
        n.setPayload(payload);
        repo.save(n);
        // push via websocket to user's queue
        messaging.convertAndSend("/queue/notifications." + userId, n);
        // send email if configured
        if (sendGridApiKey != null && !sendGridApiKey.isBlank() && emailTo != null) {
            sendEmail(emailTo, emailSubject, payload);
        }
        return n;
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SendGrid sg = new SendGrid(sendGridApiKey);
            Mail mail = new Mail(new Email("noreply@secondhand.college"), subject, new Email(to), new Content("text/html", body));
            Request req = new Request();
            req.setMethod(Method.POST);
            req.setEndpoint("mail/send");
            req.setBody(mail.build());
            sg.api(req);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}