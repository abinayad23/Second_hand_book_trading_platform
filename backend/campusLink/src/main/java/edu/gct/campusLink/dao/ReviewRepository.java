package edu.gct.campusLink.dao;

import edu.gct.campusLink.bean.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBookId(Long bookId);
    List<Review> findByReviewerId(Long reviewerId);
    List<Review> findBySellerId(Long sellerId);
}