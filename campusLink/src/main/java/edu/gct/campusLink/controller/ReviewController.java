package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.Review;
import edu.gct.campusLink.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:5174"}, allowCredentials = "true")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/add")
    public ResponseEntity<Review> addReview(@RequestParam Long reviewerId,
                                            @RequestParam Long bookId,
                                            @RequestParam int rating,
                                            @RequestParam String comment) {
        try {
            Review review = reviewService.addReview(reviewerId, bookId, rating, comment);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/seller/add")
    public ResponseEntity<Review> addSellerReview(@RequestParam Long reviewerId,
                                                   @RequestParam Long sellerId,
                                                   @RequestParam int rating,
                                                   @RequestParam String comment) {
        try {
            Review review = reviewService.addSellerReview(reviewerId, sellerId, rating, comment);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<Review>> getReviewsByBook(@PathVariable Long bookId) {
        try {
            List<Review> reviews = reviewService.getReviewsByBook(bookId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(List.of());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable Long userId) {
        try {
            List<Review> reviews = reviewService.getReviewsByUser(userId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(List.of());
        }
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Review>> getReviewsBySeller(@PathVariable Long sellerId) {
        try {
            List<Review> reviews = reviewService.getReviewsBySeller(sellerId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(List.of());
        }
    }
}