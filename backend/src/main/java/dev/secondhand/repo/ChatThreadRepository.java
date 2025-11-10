package dev.secondhand.repo;

import dev.secondhand.model.ChatThread;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ChatThreadRepository extends JpaRepository<ChatThread, Long> {
    Optional<ChatThread> findByBookIdAndBuyerIdAndSellerId(Long bookId, Long buyerId, Long sellerId);
}