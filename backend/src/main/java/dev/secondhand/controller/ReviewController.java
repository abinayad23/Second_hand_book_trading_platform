package dev.secondhand.controller;

import dev.secondhand.model.Review;
import dev.secondhand.repo.ReviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewRepository repo;
    public ReviewController(ReviewRepository repo) { this.repo = repo; }

    @PostMapping
    public ResponseEntity<?> post(@RequestBody Review r) {
        Review saved = repo.save(r);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<?> forBook(@PathVariable Long bookId) {
        List<Review> list = repo.findByBookIdOrderByCreatedAtDesc(bookId);
        return ResponseEntity.ok(list);
    }
}