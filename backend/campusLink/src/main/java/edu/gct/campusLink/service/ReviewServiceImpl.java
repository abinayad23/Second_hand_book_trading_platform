package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Book;
import edu.gct.campusLink.bean.Review;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.dao.BookRepository;
import edu.gct.campusLink.dao.ReviewRepository;
import edu.gct.campusLink.dao.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository,
                             UserRepository userRepository,
                             BookRepository bookRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public Review addReview(Long reviewerId, Long bookId, int rating, String comment) {
        User reviewer = userRepository.findById(reviewerId).orElseThrow();
        Book book = bookRepository.findById(bookId).orElseThrow();

        Review review = new Review();
        review.setReviewer(reviewer);
        review.setBook(book);
        review.setRating(rating);
        review.setComment(comment);

        if (book.getOwner() != null) {
            review.setSeller(book.getOwner());
        }

        Review savedReview = reviewRepository.save(review);

        // Update seller overall rating
        updateSellerRating(review.getSeller());

        return savedReview;
    }

    @Override
    public Review addSellerReview(Long reviewerId, Long sellerId, int rating, String comment) {
        User reviewer = userRepository.findById(reviewerId).orElseThrow();
        User seller = userRepository.findById(sellerId).orElseThrow();

        Review review = new Review();
        review.setReviewer(reviewer);
        review.setSeller(seller);
        review.setRating(rating);
        review.setComment(comment);

        Review savedReview = reviewRepository.save(review);

        // Update seller overall rating
        updateSellerRating(seller);

        return savedReview;
    }

    private void updateSellerRating(User seller) {
        Double avgRating = reviewRepository.findAverageRatingForSeller(seller.getId());
        Long reviewCount = reviewRepository.findReviewCountForSeller(seller.getId());

        seller.setRating(avgRating != null ? avgRating : 0.0);
        seller.setReviewCount(reviewCount != null ? reviewCount : 0L);

        userRepository.save(seller);
    }

    @Override
    public List<Review> getReviewsByBook(Long bookId) {
        return reviewRepository.findByBookId(bookId);
    }

    @Override
    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByReviewerId(userId);
    }

    @Override
    public List<Review> getReviewsBySeller(Long sellerId) {
        return reviewRepository.findBySellerId(sellerId);
    }

    @Override
    public double getAverageRatingForSeller(Long sellerId) {
        Double avg = reviewRepository.findAverageRatingForSeller(sellerId);
        return avg != null ? avg : 0.0;
    }

    @Override
    public long getReviewCountForSeller(Long sellerId) {
        Long count = reviewRepository.findReviewCountForSeller(sellerId);
        return count != null ? count : 0L;
    }
}
