package edu.gct.campusLink.dao;

import edu.gct.campusLink.bean.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBookId(Long bookId);
    List<Review> findByReviewerId(Long reviewerId);
    List<Review> findBySellerId(Long sellerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.seller.id = :sellerId")
    Double findAverageRatingForSeller(@Param("sellerId") Long sellerId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.seller.id = :sellerId")
    Long findReviewCountForSeller(@Param("sellerId") Long sellerId);
}
