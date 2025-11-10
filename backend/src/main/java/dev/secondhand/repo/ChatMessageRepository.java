package dev.secondhand.repo;

import dev.secondhand.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByThreadIdOrderByCreatedAtAsc(Long threadId);
}