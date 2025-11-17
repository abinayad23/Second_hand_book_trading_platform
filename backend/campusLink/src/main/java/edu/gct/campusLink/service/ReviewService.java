package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Review;
import java.util.List;

public interface ReviewService {
    Review addReview(Long reviewerId, Long bookId, int rating, String comment);
    Review addSellerReview(Long reviewerId, Long sellerId, int rating, String comment);
    List<Review> getReviewsByBook(Long bookId);
    List<Review> getReviewsByUser(Long userId);
    List<Review> getReviewsBySeller(Long sellerId);
}