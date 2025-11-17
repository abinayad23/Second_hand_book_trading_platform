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
        
        // Set seller from book owner
        if (book.getOwner() != null) {
            review.setSeller(book.getOwner());
        }

        return reviewRepository.save(review);
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

        return reviewRepository.save(review);
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
}