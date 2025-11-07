package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.Review;
import edu.gct.campusLink.service.ReviewService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/add")
    public Review addReview(@RequestParam Long reviewerId,
                            @RequestParam Long bookId,
                            @RequestParam int rating,
                            @RequestParam String comment) {
        return reviewService.addReview(reviewerId, bookId, rating, comment);
    }

    @GetMapping("/book/{bookId}")
    public List<Review> getReviewsByBook(@PathVariable Long bookId) {
        return reviewService.getReviewsByBook(bookId);
    }

    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUser(@PathVariable Long userId) {
        return reviewService.getReviewsByUser(userId);
    }
}