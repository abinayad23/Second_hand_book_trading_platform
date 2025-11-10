package dev.secondhand.repo;

import dev.secondhand.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBookIdOrderByCreatedAtDesc(Long bookId);
    List<Review> findBySellerIdOrderByCreatedAtDesc(Long sellerId);
}